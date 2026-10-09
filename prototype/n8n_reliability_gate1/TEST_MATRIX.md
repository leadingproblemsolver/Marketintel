# Six hostile-mode acceptance tests (NOT YET LIVE TESTED)
All live test receipts must include n8n version, import outcome, execution ID, input, observed output, incident notification, recovery result and timestamp.

1. **Continue-On-Fail green status**: injected HTTP 500 returns handled node error; assert business-success assertion refuses green status and records an incident.
2. **Zero-items success**: source returns []; assert an explicit expected-minimum-items check raises alert rather than success.
3. **Inactive error workflow**: disable/error-unlink notification workflow; assert independent probe reports missing notification.
4. **Side effect before commit**: simulate external charge/message succeeds but state persistence fails; assert idempotency key prevents a duplicate side effect on retry.
5. **Dead schedules**: deactivate/pause target workflow, miss two expected intervals; assert independent heartbeat monitor alerts.
6. **Error output swallowed**: wire per-node error to no-op handling; assert separate business invariant/structured failure record catches it.

**Pass only with live n8n execution and receipt, not with offline static analysis.**
