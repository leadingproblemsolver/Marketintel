# Whop listing: $149 Custom Workflow Reliability Audit

Copy each block into the matching Whop field (labels vary by Whop's form; match by meaning).
Items marked **[OWNER]** are decisions only you can make. Do not publish until each is filled in with something you can actually deliver. Nothing here is a result, testimonial or guarantee.

## Product type
One-time payment, service (not a digital download). Price: **$149 USD**. No trial, no discount, no countdown.

## Name
Custom Workflow Reliability Audit (n8n)

## Short description (one line)
A written review of one n8n workflow you submit, covering plausible silent-failure risks, with prioritized recommendations.

## Long description
**What it is**
A review of one n8n workflow you submit. I look for plausible silent-failure risks: situations where a run can look successful while the business outcome is wrong or missing. Categories reviewed:
1. Continue-on-fail hiding a real error
2. Zero items treated as success
3. Error alerting that is unlinked, inactive or misconfigured
4. Side effects happening before state is saved (duplicate-on-retry risk)
5. Schedules that stop without any failed execution
6. Error outputs wired to nothing

**What you receive**
- A written risk report for the submitted workflow
- Prioritized remediation recommendations
- Delivered electronically to the email you used at purchase **[OWNER: confirm delivery method]**

**What you do not receive**
- No claim that every failure will be found or prevented
- Not monitoring, and not a guarantee of future reliability
- Not a live execution test of your workflow unless we agree that in writing
- I do not make changes to your workflows unless agreed in writing

**What I need from you**
- A workflow export you have the right to share, with credentials, API keys and customer personal data removed
- A short note on what the workflow must reliably do

**Timeframe:** **[OWNER: state a real delivery time you will meet, e.g. "within N business days of receiving your export". Leave blank in Whop until decided.]**

## What happens after you pay
1. **[OWNER: how the buyer sends the export. e.g. reply to the Whop confirmation email, or a Whop post-purchase field/link. Use only what the Whop product actually supports.]**
2. Report delivered within the stated timeframe.
3. If the submission is unusable, say what is missing **[OWNER: policy]**.

## Refund policy (required by most checkouts)
**[OWNER: write the real policy.]** Suggested structure, edit to what you will honor: refund available before work starts; after delivery, refund only if the report was not delivered within the stated timeframe. Whatever you choose, copy it word-for-word into `site/terms.html` under "Refunds".

## Support
**[OWNER: a support email or channel you will monitor.]** Add the same to `site/terms.html` under "Support".

## FAQ
- **Will this find every problem?** No. It reviews plausible silent-failure risks in what you submit and says so in the report.
- **Do you need access to my n8n?** Only the exported workflow JSON **[OWNER: confirm]**. Never send credentials.
- **Do you fix it for me?** Recommendations only, unless agreed in writing.

## Going live checklist
1. Create the Whop product with the fields above; all **[OWNER]** items filled.
2. Copy the Whop checkout link.
3. Set `auditCheckoutUrl` in `site/site.config.js` to that link. The "Pay $149" button appears, the "Payment is not open yet" notice hides, and `checkout_start` fires on click.
4. Update `site/terms.html`: delivery timeframe, refund policy, support channel. Update `site/privacy.html` to say Whop processes payment (and what Whop receives).
5. `npm test` (add the real values to the test expectations if you change wording), then deploy.
6. `purchase` event: wire only from a verified Whop confirmation (webhook or Whop's own order data). It is intentionally not fired from the page.
