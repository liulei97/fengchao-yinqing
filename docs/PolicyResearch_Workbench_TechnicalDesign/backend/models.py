"""Pydantic v2 reference API schemas. Not a substitute for authorization/DB constraints."""
from __future__ import annotations
from datetime import date, datetime
from enum import StrEnum
from typing import Annotated, Literal
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class ApiModel(BaseModel):
    model_config = ConfigDict(extra='forbid')


class TaskStatus(StrEnum):
    draft='draft'; queued='queued'; running='running'; waiting_input='waiting_input'
    waiting_review='waiting_review'; paused='paused'; failed='failed'
    cancelled='cancelled'; completed='completed'


class TaskBudget(ApiModel):
    max_model_calls: int = Field(ge=0)
    max_tool_calls: int = Field(ge=0)
    max_cost_usd: float | None = Field(default=None, ge=0)
    deadline_at: datetime | None = None


class ResearchTask(ApiModel):
    id: UUID
    workspace_id: UUID
    project_id: UUID | None = None
    title: str
    question: str
    jurisdiction: list[str]
    policy_as_of_date: date
    profile_id: str
    profile_version: str
    status: TaskStatus
    revision: int = Field(ge=0)
    current_stage_run_id: UUID | None = None
    active_attempt_id: UUID | None = None
    last_event_seq: int = Field(ge=0)
    budget: TaskBudget
    created_at: datetime
    updated_at: datetime


class TaskAttempt(ApiModel):
    id: UUID
    task_id: UUID
    attempt_no: int = Field(ge=1)
    status: Literal['running','interrupted','completed','failed','cancelled']
    fence_token: int = Field(ge=1)
    lease_owner: str | None = None
    lease_expires_at: datetime | None = None
    runner_type: Literal['langgraph','agent_loop','deterministic']
    runner_thread_id: str | None = None
    checkpoint_ref: str | None = None
    started_at: datetime
    ended_at: datetime | None = None


class ResearchStageRun(ApiModel):
    id: UUID
    task_id: UUID
    attempt_id: UUID
    key: Literal['scope','discover','read','analyze','challenge','review','publish']
    title: str
    status: Literal['pending','running','blocked','completed','failed','skipped']
    gate: Literal['none','automatic','human']
    started_at: datetime | None = None
    ended_at: datetime | None = None
    blocker_code: str | None = None


class SourceDocument(ApiModel):
    id: UUID
    workspace_id: UUID
    title: str
    origin: Literal['upload','local_path','official_website','knowledge_mcp','other_web']
    canonical_uri: str | None = None
    issuer: str | None = None
    doc_number: str | None = None
    created_at: datetime


class SourceVersion(ApiModel):
    id: UUID
    source_id: UUID
    version_label: str
    sha256: str
    retrieved_at: datetime
    issued_at: date | None = None
    effective_from: date | None = None
    effective_until: date | None = None
    validity_as_of: date | None = None
    validity_status: Literal['effective','not_yet_effective','expired','repealed','partially_repealed','unknown','not_applicable']
    validity_checked_at: datetime | None = None
    validity_basis_evidence_id: UUID | None = None
    parser_version: str | None = None
    index_version: str | None = None
    page_count: int | None = Field(default=None, ge=0)
    extraction_status: Literal['pending','partial','complete','failed']
    object_ref: str


class PDFAnchor(ApiModel):
    kind: Literal['pdf']
    page_index: int = Field(ge=0)
    bbox: tuple[float,float,float,float] | None = None
    text_start: int | None = Field(default=None, ge=0)
    text_end: int | None = Field(default=None, ge=0)


class TextAnchor(ApiModel):
    kind: Literal['text']
    start_offset: int = Field(ge=0)
    end_offset: int = Field(ge=0)
    heading_path: list[str]


class WebAnchor(ApiModel):
    kind: Literal['web']
    fragment: str | None = None
    quote_hash: str | None = None


class GISAnchor(ApiModel):
    kind: Literal['gis']
    layer_id: str
    feature_id: str


EvidenceAnchor = Annotated[PDFAnchor | TextAnchor | WebAnchor | GISAnchor, Field(discriminator='kind')]


class EvidenceItem(ApiModel):
    id: UUID
    task_id: UUID
    source_version_id: UUID
    anchor: EvidenceAnchor
    excerpt: str
    excerpt_sha256: str
    extraction_method: Literal['native_text','ocr','web_fetch','manual']
    fidelity: Literal['verified_against_source','needs_review','unverifiable']
    recorded_at: datetime
    recorded_by: Literal['agent','user','system']


class Claim(ApiModel):
    id: UUID
    task_id: UUID
    kind: Literal['normative_fact','historical_fact','empirical_fact','interpretation','recommendation']
    status: Literal['proposed','supported','contested','rejected','approved']
    current_revision_id: UUID
    owner_stage_run_id: UUID | None = None
    created_at: datetime


class ClaimRevision(ApiModel):
    id: UUID
    claim_id: UUID
    revision_no: int = Field(ge=1)
    statement: str
    explanation: str
    assumptions: list[str]
    limitations: list[str]
    authored_by: Literal['agent','user']
    created_at: datetime


class ClaimEvidenceLink(ApiModel):
    id: UUID
    claim_revision_id: UUID
    evidence_id: UUID
    relation: Literal['supports','refutes','qualifies','context']
    rationale: str
    assessment: Literal['unreviewed','reviewed','disputed']


class CoverageDimension(ApiModel):
    key: str
    title: str
    assessment: Literal['not_started','insufficient','partial','sufficient','conflicting']
    supporting_source_count: int = Field(ge=0)
    evidence_count: int = Field(ge=0)
    gaps: list[str]


class EvidenceReadModel(ApiModel):
    sources: list[SourceDocument]
    versions: list[SourceVersion]
    items: list[EvidenceItem]
    claims: list[Claim]
    claim_revisions: list[ClaimRevision]
    claim_links: list[ClaimEvidenceLink]
    coverage: list[CoverageDimension]


class TrailEvent(ApiModel):
    id: UUID
    task_id: UUID
    attempt_id: UUID | None = None
    seq: int = Field(ge=1)
    occurred_at: datetime
    type: str
    title: str
    summary: str | None = None
    actor: Literal['user','agent','runner','system']
    stage_run_id: UUID | None = None
    trace_id: str | None = None
    span_id: str | None = None
    ref_ids: list[UUID]
    payload: dict


class RunHealth(ApiModel):
    heartbeat_at: datetime | None = None
    active_tool: str | None = None
    model_calls: int = Field(ge=0)
    tool_calls: int = Field(ge=0)
    failed_calls: int = Field(ge=0)
    total_estimated_cost_usd: float | None = Field(default=None, ge=0)
    review_blockers: list[str]
    source_parse_failures: int = Field(ge=0)


class TaskArtifact(ApiModel):
    id: UUID
    task_id: UUID
    version: int = Field(ge=1)
    title: str
    mime_type: str
    status: Literal['draft','awaiting_review','approved','published']
    created_at: datetime
    storage_ref: str


class WorkbenchSnapshot(ApiModel):
    schema_version: Literal['1.0']
    snapshot_seq: int = Field(ge=0)
    task: ResearchTask
    attempt: TaskAttempt | None = None
    stages: list[ResearchStageRun]
    evidence: EvidenceReadModel
    recent_events: list[TrailEvent]
    health: RunHealth
    artifacts: list[TaskArtifact]


class TaskActionRequest(ApiModel):
    action: Literal['start','pause','resume','cancel','retry','request_review','approve','reject']
    expected_revision: int = Field(ge=0)
    idempotency_key: str = Field(min_length=8, max_length=128)
    attempt_id: UUID | None = None
    reason: str | None = None
