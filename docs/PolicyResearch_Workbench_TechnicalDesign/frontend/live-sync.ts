/** Example live-stream reducer and cursor recovery for Workbench v1.
 * This file intentionally does not initiate task actions or assume an API token.
 * Use only in the browser with a same-origin authenticated session.
 */
import type { ResearchTask, TaskStatus, TrailEvent, WorkbenchSnapshot } from '../contracts/policy-research';

type ReadModelName = 'task' | 'attempt' | 'stages' | 'evidence' | 'health' | 'artifacts';
export interface LiveState {
  snapshot: WorkbenchSnapshot;
  lastSeq: number;
  invalidated: ReadonlySet<ReadModelName>;
  gapDetected: boolean;
}
const taskStatuses = new Set<TaskStatus>([
  'draft', 'queued', 'running', 'waiting_input', 'waiting_review',
  'paused', 'failed', 'cancelled', 'completed',
]);
export const initLiveState = (snapshot: WorkbenchSnapshot): LiveState => ({
  snapshot, lastSeq: snapshot.snapshot_seq, invalidated: new Set(), gapDetected: false,
});

export function acceptEvent(state: LiveState, event: TrailEvent): LiveState {
  if (event.task_id !== state.snapshot.task.id) return state; // Wrong stream; ignore & audit server-side.
  if (event.seq <= state.lastSeq) return state; // Retry or SSE reconnect duplicate.
  if (event.seq !== state.lastSeq + 1) return { ...state, gapDetected: true };

  let task: ResearchTask = state.snapshot.task;
  const invalidated = new Set<ReadModelName>(state.invalidated);
  switch (event.type) {
    case 'task.status_changed': {
      const p = event.payload;
      if (typeof p.to === 'string' && taskStatuses.has(p.to as TaskStatus)
          && typeof p.revision === 'number' && Number.isSafeInteger(p.revision)
          && p.revision >= task.revision) {
        task = { ...task, status: p.to as TaskStatus, revision: p.revision };
      } else {
        invalidated.add('task');
      }
      break;
    }
    case 'attempt.started':
    case 'attempt.ended':
    case 'checkpoint.created': invalidated.add('attempt'); break;
    case 'stage.started':
    case 'stage.completed':
    case 'stage.blocked': invalidated.add('stages'); break;
    case 'source.registered':
    case 'source.read':
    case 'evidence.recorded':
    case 'claim.proposed':
    case 'claim.revised':
    case 'claim.reviewed':
    case 'conflict.detected': invalidated.add('evidence'); break;
    case 'artifact.created':
    case 'artifact.approved': invalidated.add('artifacts'); break;
    case 'tool.finished':
    case 'tool.failed':
    case 'model.call_completed': invalidated.add('health'); break;
    case 'task.error': invalidated.add('task'); invalidated.add('health'); break;
    default: break;
  }
  const events = state.snapshot.recent_events
    .filter(e => e.seq !== event.seq).concat(event).slice(-250);
  return {
    snapshot: {
      ...state.snapshot,
      task: { ...task, last_event_seq: event.seq },
      recent_events: events,
      snapshot_seq: event.seq,
    },
    lastSeq: event.seq,
    invalidated,
    gapDetected: false,
  };
}

export type StreamHandlers = {
  onEvent: (event: TrailEvent) => void;
  onResyncRequired: () => void;
  onConnectionError?: () => void;
};

/** Each event is published via its event type, e.g. `event: claim.revised`.
 * Server must authorize every request and support `after_seq` replay from durable event log.
 */
export function connectTaskEventStream(
  baseApiUrl: string,
  taskId: string,
  afterSeq: number,
  handlers: StreamHandlers,
): () => void {
  const url = `${baseApiUrl}/tasks/${encodeURIComponent(taskId)}/events?after_seq=${afterSeq}`;
  const stream = new EventSource(url, { withCredentials: true });
  const eventTypes = [
    'task.created','task.status_changed','attempt.started','attempt.ended',
    'stage.started','stage.completed','stage.blocked','tool.started','tool.finished','tool.failed',
    'model.call_completed','skill.activated','source.registered','source.read',
    'evidence.recorded','claim.proposed','claim.revised','claim.reviewed','conflict.detected',
    'review.requested','review.resolved','checkpoint.created','artifact.created',
    'artifact.approved','task.error',
  ];
  for (const type of eventTypes) {
    stream.addEventListener(type, (msg: Event) => {
      try {
        const payload = JSON.parse((msg as MessageEvent<string>).data) as TrailEvent;
        // Production: validate wire contract with Zod/JSON Schema before accepting payload.
        if (payload.type === type) handlers.onEvent(payload);
        else handlers.onResyncRequired();
      } catch { handlers.onResyncRequired(); }
    });
  }
  stream.addEventListener('resync-required', () => handlers.onResyncRequired());
  stream.onerror = () => handlers.onConnectionError?.(); // Native EventSource retries automatically.
  return () => stream.close();
}
