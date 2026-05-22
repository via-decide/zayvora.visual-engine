# Full Visual Engine Integration

Zayvora Visual Engine now runs one deterministic pipeline from prompt to output for HTML and Remotion.

Pipeline:

PROMPT
↓
ENRICHMENT
↓
ZAYVORA CORE
↓
TRACE
↓
VISUAL CONTRACT
↓
RENDER TARGET ROUTER
↓
HTML / REMOTION / JSON
↓
OUTPUT MANIFEST

No renderer invents structure. All outputs derive from the same render contract.
