import json
from pathlib import Path
from uuid import UUID
ROOT=Path(__file__).parent
ids = {
 'task':'11111111-1111-4111-8111-111111111111',
 'workspace':'22222222-2222-4222-8222-222222222222',
 'attempt':'33333333-3333-4333-8333-333333333333',
 'stage':'44444444-4444-4444-8444-444444444444',
 'source':'55555555-5555-4555-8555-555555555555',
 'version':'66666666-6666-4666-8666-666666666666',
 'evidence':'77777777-7777-4777-8777-777777777777',
 'claim':'88888888-8888-4888-8888-888888888888',
 'claim_rev':'99999999-9999-4999-8999-999999999999',
 'link':'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
 'event':'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
}
now='2026-10-22T05:55:00+00:00'
snapshot={
 'schema_version':'1.0','snapshot_seq':7,
 'task':{'id':ids['task'],'workspace_id':ids['workspace'],'project_id':None,
 'title':'土地储备制度研究（演示）','question':'土地储备与集中供应机制之间有何关系？',
 'jurisdiction':['中国大陆'],'policy_as_of_date':'2026-10-22','profile_id':'policy-deep-research',
 'profile_version':'2.0.0','status':'running','revision':3,
 'current_stage_run_id':ids['stage'],'active_attempt_id':ids['attempt'],'last_event_seq':7,
 'budget':{'max_model_calls':20,'max_tool_calls':70,'max_cost_usd':10.0,'deadline_at':None},
 'created_at':now,'updated_at':now},
 'attempt':{'id':ids['attempt'],'task_id':ids['task'],'attempt_no':1,'status':'running','fence_token':1,
 'lease_owner':'runner-01','lease_expires_at':'2026-10-22T06:00:00+00:00','runner_type':'langgraph',
 'runner_thread_id':'thread-policy-demo','checkpoint_ref':'lg:checkpoint:demo-1',
 'started_at':now,'ended_at':None},
 'stages':[{'id':ids['stage'],'task_id':ids['task'],'attempt_id':ids['attempt'],'key':'analyze',
 'title':'制度机制研究','status':'running','gate':'automatic','started_at':now,'ended_at':None,'blocker_code':None}],
 'evidence':{'sources':[{'id':ids['source'],'workspace_id':ids['workspace'],'title':'演示政策资料 A（非真实文件）',
 'origin':'upload','canonical_uri':None,'issuer':None,'doc_number':None,'created_at':now}],
 'versions':[{'id':ids['version'],'source_id':ids['source'],'version_label':'演示版','sha256':'0'*64,
 'retrieved_at':now,'issued_at':None,'effective_from':None,'effective_until':None,
 'validity_as_of':None,'validity_status':'unknown','validity_checked_at':None,
 'validity_basis_evidence_id':None,'parser_version':'demo','index_version':None,
 'page_count':1,'extraction_status':'complete','object_ref':'objects/demo-source-A'}],
 'items':[{'id':ids['evidence'],'task_id':ids['task'],'source_version_id':ids['version'],
 'anchor':{'kind':'pdf','page_index':0,'bbox':None,'text_start':0,'text_end':18},
 'excerpt':'演示占位文本，不构成任何真实政策依据。','excerpt_sha256':'0'*64,
 'extraction_method':'native_text','fidelity':'needs_review','recorded_at':now,'recorded_by':'agent'}],
 'claims':[{'id':ids['claim'],'task_id':ids['task'],'kind':'interpretation','status':'proposed',
 'current_revision_id':ids['claim_rev'],'owner_stage_run_id':ids['stage'],'created_at':now}],
 'claim_revisions':[{'id':ids['claim_rev'],'claim_id':ids['claim'],'revision_no':1,
 'statement':'土地集中供应可能影响土地上市节奏（研究假设）',
 'explanation':'仅为界面样例；尚未找到足够的有效政策证据。','assumptions':['地方政府有供应调控权'],
 'limitations':['演示资料不能作为真实证据'], 'authored_by':'agent','created_at':now}],
 'claim_links':[{'id':ids['link'],'claim_revision_id':ids['claim_rev'],'evidence_id':ids['evidence'],
 'relation':'context','rationale':'仅作演示关联，不支持该论点。','assessment':'unreviewed'}],
 'coverage':[{'key':'mechanism','title':'制度作用机制','assessment':'insufficient',
 'supporting_source_count':0,'evidence_count':0,'gaps':['缺少真实的规范依据和历史材料']} ]},
 'recent_events':[{'id':ids['event'],'task_id':ids['task'],'attempt_id':ids['attempt'],'seq':7,
 'occurred_at':now,'type':'claim.proposed','title':'提出待验证的制度机制假设','summary':'该假设尚无真实证据支持。',
 'actor':'agent','stage_run_id':ids['stage'],'trace_id':'trace-demo','span_id':'span-demo',
 'ref_ids':[ids['claim']],'payload':{'claim_id':ids['claim'],'revision_id':ids['claim_rev']}}],
 'health':{'heartbeat_at':now,'active_tool':None,'model_calls':2,'tool_calls':4,'failed_calls':0,
 'total_estimated_cost_usd':0.14,'review_blockers':['待补充官方原文'],'source_parse_failures':0},
 'artifacts':[]
}
(ROOT/'workbench-snapshot.json').write_text(json.dumps(snapshot,ensure_ascii=False,indent=2),encoding='utf-8')
from sys import path
path.insert(0,str(ROOT.parent/'backend'))
from models import WorkbenchSnapshot
s=WorkbenchSnapshot.model_validate(snapshot)
print('validated snapshot',s.schema_version,s.task.status, s.snapshot_seq)
