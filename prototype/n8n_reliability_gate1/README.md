# Gate 1: Offline Audit Prototype (NOT a sellable product)

Run `python preflight.py <workflow-export.json>` to get heuristic risk flags.
Run `python -m unittest -v test_preflight.py` for six synthetic assertions.

The scanner intentionally flags **possible** risks. It does not prove an incident, verify recovery, determine whether error handlers are correct, check live workflow status, or import/test files in n8n. Its presence must not be claimed to establish commercial differentiation from free alert templates.

Required next step: obtain the actual existing n8n workflow JSON files and a clean n8n instance; execute the six hostile modes in TEST_MATRIX.md and retain execution receipts. Gate 1 stays 0/6 until the five distinct commercial deliverables are assembled and tested.
