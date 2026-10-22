-- Reference PostgreSQL 16+ schema. Requires your existing workspace/identity service.
-- Execute in a controlled migration account. All access from the API must be workspace scoped.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS research_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  project_id uuid,
  title text NOT NULL,
  question text NOT NULL,
  jurisdiction jsonb NOT NULL DEFAULT '[]'::jsonb,
  policy_as_of_date date NOT NULL,
  profile_id text NOT NULL,
  profile_version text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','queued','running','waiting_input','waiting_review','paused','failed','cancelled','completed')),
  revision bigint NOT NULL DEFAULT 0 CHECK (revision >= 0),
  last_event_seq bigint NOT NULL DEFAULT 0 CHECK (last_event_seq >= 0),
  active_attempt_id uuid,
  current_stage_run_id uuid,
  budget jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, workspace_id)
);

CREATE TABLE IF NOT EXISTS task_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  task_id uuid NOT NULL,
  attempt_no integer NOT NULL CHECK (attempt_no >= 1),
  status text NOT NULL CHECK (status IN ('running','interrupted','completed','failed','cancelled')),
  fence_token bigint NOT NULL CHECK (fence_token >= 1),
  lease_owner text,
  lease_expires_at timestamptz,
  runner_type text NOT NULL CHECK (runner_type IN ('langgraph','agent_loop','deterministic')),
  runner_thread_id text,
  checkpoint_ref text,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  UNIQUE (task_id, attempt_no),
  UNIQUE (task_id, fence_token),
  UNIQUE (id, task_id, workspace_id),
  FOREIGN KEY (task_id, workspace_id) REFERENCES research_tasks (id, workspace_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS task_stage_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  task_id uuid NOT NULL,
  attempt_id uuid NOT NULL,
  stage_key text NOT NULL CHECK (stage_key IN ('scope','discover','read','analyze','challenge','review','publish')),
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending','running','blocked','completed','failed','skipped')),
  gate text NOT NULL DEFAULT 'none' CHECK (gate IN ('none','automatic','human')),
  started_at timestamptz,
  ended_at timestamptz,
  blocker_code text,
  FOREIGN KEY (attempt_id, task_id, workspace_id) REFERENCES task_attempts (id, task_id, workspace_id),
  UNIQUE (id, task_id, workspace_id)
);

CREATE TABLE IF NOT EXISTS source_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  title text NOT NULL,
  origin text NOT NULL CHECK (origin IN ('upload','local_path','official_website','knowledge_mcp','other_web')),
  canonical_uri text,
  issuer text,
  doc_number text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, workspace_id)
);

CREATE TABLE IF NOT EXISTS source_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  source_id uuid NOT NULL,
  version_label text NOT NULL,
  sha256 char(64) NOT NULL,
  retrieved_at timestamptz NOT NULL,
  issued_at date,
  effective_from date,
  effective_until date,
  validity_as_of date,
  validity_status text NOT NULL DEFAULT 'unknown'
    CHECK (validity_status IN ('effective','not_yet_effective','expired','repealed','partially_repealed','unknown','not_applicable')),
  validity_checked_at timestamptz,
  validity_basis_evidence_id uuid,
  parser_version text,
  index_version text,
  page_count integer CHECK (page_count >= 0),
  extraction_status text NOT NULL DEFAULT 'pending' CHECK (extraction_status IN ('pending','partial','complete','failed')),
  object_ref text NOT NULL,
  FOREIGN KEY (source_id, workspace_id) REFERENCES source_documents (id, workspace_id),
  UNIQUE (id, workspace_id),
  UNIQUE (source_id, sha256)
);

CREATE TABLE IF NOT EXISTS evidence_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  task_id uuid NOT NULL,
  source_version_id uuid NOT NULL,
  anchor jsonb NOT NULL,
  excerpt text NOT NULL,
  excerpt_sha256 char(64) NOT NULL,
  extraction_method text NOT NULL CHECK (extraction_method IN ('native_text','ocr','web_fetch','manual')),
  fidelity text NOT NULL CHECK (fidelity IN ('verified_against_source','needs_review','unverifiable')),
  recorded_at timestamptz NOT NULL DEFAULT now(),
  recorded_by text NOT NULL CHECK (recorded_by IN ('agent','user','system')),
  FOREIGN KEY (task_id, workspace_id) REFERENCES research_tasks (id, workspace_id),
  FOREIGN KEY (source_version_id, workspace_id) REFERENCES source_versions (id, workspace_id),
  UNIQUE (id, task_id, workspace_id)
);

CREATE TABLE IF NOT EXISTS research_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  task_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('normative_fact','historical_fact','empirical_fact','interpretation','recommendation')),
  status text NOT NULL CHECK (status IN ('proposed','supported','contested','rejected','approved')),
  current_revision_id uuid,
  owner_stage_run_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (task_id, workspace_id) REFERENCES research_tasks (id, workspace_id),
  UNIQUE (id, task_id, workspace_id)
);

CREATE TABLE IF NOT EXISTS claim_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  task_id uuid NOT NULL,
  claim_id uuid NOT NULL,
  revision_no integer NOT NULL CHECK (revision_no >= 1),
  statement text NOT NULL,
  explanation text NOT NULL,
  assumptions jsonb NOT NULL DEFAULT '[]'::jsonb,
  limitations jsonb NOT NULL DEFAULT '[]'::jsonb,
  authored_by text NOT NULL CHECK (authored_by IN ('agent','user')),
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (claim_id, task_id, workspace_id) REFERENCES research_claims (id, task_id, workspace_id),
  UNIQUE (claim_id, revision_no),
  UNIQUE (id, task_id, workspace_id)
);

CREATE TABLE IF NOT EXISTS claim_evidence_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  task_id uuid NOT NULL,
  claim_revision_id uuid NOT NULL,
  evidence_id uuid NOT NULL,
  relation text NOT NULL CHECK (relation IN ('supports','refutes','qualifies','context')),
  rationale text NOT NULL,
  assessment text NOT NULL CHECK (assessment IN ('unreviewed','reviewed','disputed')),
  FOREIGN KEY (claim_revision_id, task_id, workspace_id) REFERENCES claim_revisions (id, task_id, workspace_id),
  FOREIGN KEY (evidence_id, task_id, workspace_id) REFERENCES evidence_items (id, task_id, workspace_id),
  UNIQUE (claim_revision_id, evidence_id, relation)
);

CREATE TABLE IF NOT EXISTS task_event_cursors (
  task_id uuid PRIMARY KEY,
  workspace_id uuid NOT NULL,
  last_seq bigint NOT NULL DEFAULT 0 CHECK (last_seq >= 0),
  FOREIGN KEY (task_id, workspace_id) REFERENCES research_tasks (id, workspace_id)
);

CREATE TABLE IF NOT EXISTS task_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  workspace_id uuid NOT NULL,
  task_id uuid NOT NULL,
  seq bigint NOT NULL CHECK (seq >= 1),
  attempt_id uuid,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  event_type text NOT NULL,
  title text NOT NULL,
  summary text,
  actor text NOT NULL CHECK (actor IN ('user','agent','runner','system')),
  stage_run_id uuid,
  trace_id text,
  span_id text,
  ref_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (task_id, seq),
  FOREIGN KEY (task_id, workspace_id) REFERENCES research_tasks (id, workspace_id)
);

CREATE TABLE IF NOT EXISTS task_artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  task_id uuid NOT NULL,
  version integer NOT NULL CHECK (version >= 1),
  title text NOT NULL,
  mime_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft','awaiting_review','approved','published')),
  object_ref text NOT NULL,
  checksum_sha256 char(64) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (task_id, workspace_id) REFERENCES research_tasks (id, workspace_id),
  UNIQUE (task_id, version)
);

CREATE TABLE IF NOT EXISTS task_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  task_id uuid NOT NULL,
  idempotency_key text NOT NULL,
  command_type text NOT NULL,
  expected_revision bigint NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  result_status text NOT NULL DEFAULT 'accepted',
  FOREIGN KEY (task_id, workspace_id) REFERENCES research_tasks (id, workspace_id),
  UNIQUE (task_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS event_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  task_id uuid NOT NULL,
  event_seq bigint NOT NULL,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (task_id, event_seq) REFERENCES task_events (task_id, seq),
  UNIQUE (task_id, event_seq)
);

CREATE INDEX IF NOT EXISTS idx_tasks_ws_status ON research_tasks(workspace_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_task_time ON task_events(task_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_evidence_task_source ON evidence_items(task_id, source_version_id);
CREATE INDEX IF NOT EXISTS idx_claims_task_status ON research_claims(task_id, status);
CREATE INDEX IF NOT EXISTS idx_attempts_task_started ON task_attempts(task_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_outbox_unpublished ON event_outbox(created_at) WHERE published_at IS NULL;

-- REQUIRED: Use a dedicated non-superuser API/worker role with RLS applied.
-- Set app.workspace_id with SET LOCAL inside a transaction after server-side authorization.
-- Database owners normally bypass RLS, so FORCE RLS and avoid BYPASSRLS roles.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'research_tasks','task_attempts','task_stage_runs','source_documents','source_versions',
    'evidence_items','research_claims','claim_revisions','claim_evidence_links',
    'task_event_cursors','task_events','task_artifacts','task_commands','event_outbox'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY %I ON %I USING (workspace_id = nullif(current_setting(''app.workspace_id'', true), '''')::uuid) WITH CHECK (workspace_id = nullif(current_setting(''app.workspace_id'', true), '''')::uuid)', 'workspace_scope_' || t, t);
  END LOOP;
END $$;

-- Production hardening (must be implemented separately):
-- 1. Restrict table DML privileges; only Task Core command functions mutate tasks and events.
-- 2. Make source_versions, evidence_items, claim_revisions, task_events append-only for normal roles.
-- 3. Validate legal status against a source-based effective-date record, not filename heuristics.
-- 4. Allocate task seq atomically within transaction:
--    UPDATE task_event_cursors SET last_seq=last_seq+1 WHERE task_id=:id RETURNING last_seq;
--    Then INSERT task_events + event_outbox and update research_tasks.last_event_seq.
-- 5. Updates from workers must verify matching task active_attempt_id and attempt fence_token.
-- 6. Enforce allowed TaskStatus transition graph and idempotency in Task Core.
