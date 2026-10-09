#!/usr/bin/env python3
"""Offline heuristic audit for exported n8n workflows. NOT a live execution test."""
import json, sys
from pathlib import Path

def audit(workflow):
    nodes = workflow.get('nodes', [])
    settings = workflow.get('settings', {}) or {}
    findings = []
    def flag(code, detail, severity='review'):
        findings.append({'code':code,'severity':severity,'detail':detail})
    if not isinstance(nodes,list):
        raise ValueError('nodes must be a list')
    for node in nodes:
        name=node.get('name','unnamed')
        p=node.get('parameters',{}) or {}
        if node.get('continueOnFail') is True or node.get('onError') in ('continueRegularOutput','continueErrorOutput'):
            flag('SWALLOWED_ERROR',f'{name}: continues after node error; prove that failure is surfaced and downstream side effects are blocked')
        if node.get('alwaysOutputData') is True:
            flag('ZERO_ITEM_MASK',f'{name}: alwaysOutputData can convert no rows into an output item; validate actual item count')
        if 'scheduleTrigger' in node.get('type',''):
            flag('SCHEDULE_HEARTBEAT',f'{name}: external heartbeat and expected-run alert required to detect no execution')
        if node.get('type','').endswith('.errorTrigger'):
            flag('ERROR_TRIGGER_SCOPE',f'{name}: failure-only alerting cannot detect swallowed errors or successful zero-item business outcomes')
        if any(t in node.get('type','').lower() for t in ('httprequest','postgres','mysql','stripe','googlesheets','slack','gmail')):
            flag('SIDE_EFFECT_ORDER',f'{name}: manually verify idempotency, transaction boundary, and commit/ack ordering')
    if not settings.get('errorWorkflow'):
        flag('ERROR_WORKFLOW_UNSET','No linked errorWorkflow ID found in exported workflow settings (check instance settings)')
    if workflow.get('active') is not True:
        flag('INACTIVE_WORKFLOW','Export does not show active=true; verify published/active production trigger state')
    return findings

def main():
    if len(sys.argv)!=2:
        print('Usage: python preflight.py exported_workflow.json');return 2
    data=json.loads(Path(sys.argv[1]).read_text(encoding='utf8'))
    result={'workflow':data.get('name','unknown'),'findings':audit(data),'live_import_tested':False,'production_ready':False}
    print(json.dumps(result,indent=2));return 0
if __name__=='__main__':raise SystemExit(main())
