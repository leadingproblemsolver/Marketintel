import unittest
from preflight import audit
class Tests(unittest.TestCase):
 def test_continue_on_fail(self):
  self.assertIn('SWALLOWED_ERROR',[x['code'] for x in audit({'nodes':[{'name':'Fetch','type':'n8n-nodes-base.httpRequest','continueOnFail':True}]})])
 def test_zero_item_risk(self):
  self.assertIn('ZERO_ITEM_MASK',[x['code'] for x in audit({'nodes':[{'name':'Get Items','type':'n8n-nodes-base.set','alwaysOutputData':True}]})])
 def test_inactive(self):
  self.assertIn('INACTIVE_WORKFLOW',[x['code'] for x in audit({'active':False,'nodes':[]})])
 def test_side_effect(self):
  self.assertIn('SIDE_EFFECT_ORDER',[x['code'] for x in audit({'nodes':[{'name':'Charge','type':'n8n-nodes-base.stripe'}]})])
 def test_dead_schedule(self):
  self.assertIn('SCHEDULE_HEARTBEAT',[x['code'] for x in audit({'nodes':[{'name':'Tick','type':'n8n-nodes-base.scheduleTrigger'}]})])
 def test_error_trigger_scope(self):
  self.assertIn('ERROR_TRIGGER_SCOPE',[x['code'] for x in audit({'nodes':[{'name':'Errors','type':'n8n-nodes-base.errorTrigger'}]})])
if __name__=='__main__':unittest.main()
