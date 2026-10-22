/** Personal Harness / Policy Research Workbench / shared API contracts v1. */
export type UUID = string;
export type ISODateTime = string;
export type ISODate = string;
export type TaskStatus =
  | 'draft' | 'queued' | 'running' | 'waiting_input' | 'waiting_review'
  | 'paused' | 'failed' | 'cancelled' | 'completed';
export type StageStatus = 'pending' | 'running' | 'blocked' | 'completed' | 'failed' | 'skipped';
export type AttemptStatus = 'running' | 'interrupted' | 'completed' | 'failed' | 'cancelled';
export type ValidityStatus =
  | 'effective' | 'not_yet_effective' | 'expired' | 'repealed'
  | 'partially_repealed' | 'unknown' | 'not_applicable';

export interface TaskBudget {
  max_model_calls: number;
  max_tool_calls: number;
  max_cost_usd: number | null;
  deadline_at: ISODateTime | null;
}
export interface ResearchTask {
  id: UUID;
  workspace_id: UUID;
  project_id: UUID | null;
  title: string;
  question: string;
  jurisdiction: string[];
  policy_as_of_date: ISODate; // Legal/policy validity is evaluated as of this date.
  profile_id: string;
  profile_version: string;
  status: TaskStatus;
  revision: number; // Monotonic CAS version controlled by Task Core.
  current_stage_run_id: UUID | null;
  active_attempt_id: UUID | null;
  last_event_seq: number;
  budget: TaskBudget;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}
export interface TaskAttempt {
  id: UUID;
  task_id: UUID;
  attempt_no: number;
  status: AttemptStatus;
  fence_token: number; // A monotonically increasing token; MUST be checked server-side.
  lease_owner: string | null;
  lease_expires_at: ISODateTime | null;
  runner_type: 'langgraph' | 'agent_loop' | 'deterministic';
  runner_thread_id: string | null;
  checkpoint_ref: string | null;
  started_at: ISODateTime;
  ended_at: ISODateTime | null;
}
export interface ResearchStageRun {
  id: UUID;
  task_id: UUID;
  attempt_id: UUID;
  key: 'scope' | 'discover' | 'read' | 'analyze' | 'challenge' | 'review' | 'publish';
  title: string;
  status: StageStatus;
  gate: 'none' | 'automatic' | 'human';
  started_at: ISODateTime | null;
  ended_at: ISODateTime | null;
  blocker_code: string | null;
}

export type SourceKind = 'upload' | 'local_path' | 'official_website' | 'knowledge_mcp' | 'other_web';
export interface SourceDocument {
  id: UUID;
  workspace_id: UUID;
  title: string;
  origin: SourceKind;
  canonical_uri: string | null; // May be a local canonical identifier; never expose raw secrets.
  issuer: string | null;
  doc_number: string | null;
  created_at: ISODateTime;
}
export interface SourceVersion {
  id: UUID;
  source_id: UUID;
  version_label: string;
  sha256: string;
  retrieved_at: ISODateTime;
  issued_at: ISODate | null;
  effective_from: ISODate | null;
  effective_until: ISODate | null;
  validity_as_of: ISODate | null;
  validity_status: ValidityStatus;
  validity_checked_at: ISODateTime | null;
  validity_basis_evidence_id: UUID | null;
  parser_version: string | null;
  index_version: string | null;
  page_count: number | null;
  extraction_status: 'pending' | 'partial' | 'complete' | 'failed';
  object_ref: string; // Server-side object identifier, NOT a browser-addressable path.
}
export type EvidenceAnchor =
  | { kind: 'pdf'; page_index: number; bbox: [number, number, number, number] | null; text_start: number | null; text_end: number | null }
  | { kind: 'text'; start_offset: number; end_offset: number; heading_path: string[] }
  | { kind: 'web'; fragment: string | null; quote_hash: string | null }
  | { kind: 'gis'; layer_id: string; feature_id: string };
export interface EvidenceItem {
  id: UUID;
  task_id: UUID;
  source_version_id: UUID;
  anchor: EvidenceAnchor;
  excerpt: string;
  excerpt_sha256: string;
  extraction_method: 'native_text' | 'ocr' | 'web_fetch' | 'manual';
  fidelity: 'verified_against_source' | 'needs_review' | 'unverifiable';
  recorded_at: ISODateTime;
  recorded_by: 'agent' | 'user' | 'system';
}
export type ClaimKind = 'normative_fact' | 'historical_fact' | 'empirical_fact' | 'interpretation' | 'recommendation';
export type ClaimStatus = 'proposed' | 'supported' | 'contested' | 'rejected' | 'approved';
export interface Claim {
  id: UUID;
  task_id: UUID;
  kind: ClaimKind;
  status: ClaimStatus;
  current_revision_id: UUID;
  owner_stage_run_id: UUID | null;
  created_at: ISODateTime;
}
export interface ClaimRevision {
  id: UUID;
  claim_id: UUID;
  revision_no: number;
  statement: string;
  explanation: string;
  assumptions: string[];
  limitations: string[];
  authored_by: 'agent' | 'user';
  created_at: ISODateTime;
}
export interface ClaimEvidenceLink {
  id: UUID;
  claim_revision_id: UUID;
  evidence_id: UUID;
  relation: 'supports' | 'refutes' | 'qualifies' | 'context';
  rationale: string;
  assessment: 'unreviewed' | 'reviewed' | 'disputed';
}
export interface CoverageDimension {
  key: string;
  title: string;
  assessment: 'not_started' | 'insufficient' | 'partial' | 'sufficient' | 'conflicting';
  supporting_source_count: number;
  evidence_count: number;
  gaps: string[];
}
export interface EvidenceReadModel {
  sources: SourceDocument[];
  versions: SourceVersion[];
  items: EvidenceItem[];
  claims: Claim[];
  claim_revisions: ClaimRevision[];
  claim_links: ClaimEvidenceLink[];
  coverage: CoverageDimension[];
}

export type TrailEventType =
  | 'task.created' | 'task.status_changed' | 'attempt.started' | 'attempt.ended'
  | 'stage.started' | 'stage.completed' | 'stage.blocked'
  | 'tool.started' | 'tool.finished' | 'tool.failed'
  | 'model.call_completed' | 'skill.activated'
  | 'source.registered' | 'source.read' | 'evidence.recorded'
  | 'claim.proposed' | 'claim.revised' | 'claim.reviewed'
  | 'conflict.detected' | 'review.requested' | 'review.resolved'
  | 'checkpoint.created' | 'artifact.created' | 'artifact.approved'
  | 'task.error';
export interface TrailEvent {
  id: UUID;
  task_id: UUID;
  attempt_id: UUID | null;
  seq: number; // Total order within task, unique (task_id, seq).
  occurred_at: ISODateTime;
  type: TrailEventType;
  title: string;
  summary: string | null; // Auditable event summary, NOT hidden model chain of thought.
  actor: 'user' | 'agent' | 'runner' | 'system';
  stage_run_id: UUID | null;
  trace_id: string | null;
  span_id: string | null;
  ref_ids: UUID[];
  payload: Record<string, unknown>; // Per-event shape validated by backend registry.
}
export interface ModelUsage {
  provider: string;
  requested_model: string;
  resolved_model: string;
  reasoning_tier: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  estimated_cost_usd: number | null;
  exact_cost_known: boolean;
}
export interface RunHealth {
  heartbeat_at: ISODateTime | null;
  active_tool: string | null;
  model_calls: number;
  tool_calls: number;
  failed_calls: number;
  total_estimated_cost_usd: number | null;
  review_blockers: string[];
  source_parse_failures: number;
}
export interface TaskArtifact {
  id: UUID;
  task_id: UUID;
  version: number;
  title: string;
  mime_type: string;
  status: 'draft' | 'awaiting_review' | 'approved' | 'published';
  created_at: ISODateTime;
  storage_ref: string; // Internal ref; download must be resolved by an authorized API.
}
export interface WorkbenchSnapshot {
  schema_version: '1.0';
  snapshot_seq: number; // After applying events through this sequence, client is current.
  task: ResearchTask;
  attempt: TaskAttempt | null;
  stages: ResearchStageRun[];
  evidence: EvidenceReadModel;
  recent_events: TrailEvent[];
  health: RunHealth;
  artifacts: TaskArtifact[];
}
export interface TaskActionRequest {
  action: 'start' | 'pause' | 'resume' | 'cancel' | 'retry' | 'request_review' | 'approve' | 'reject';
  expected_revision: number;
  idempotency_key: string;
  attempt_id?: UUID;
  reason?: string;
}
export interface CommandAccepted { command_id: UUID; accepted: true; status: 'accepted' | 'queued'; }
