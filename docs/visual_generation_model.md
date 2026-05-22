# Visual Generation Data Model

Zayvora Visual Engine treats visual generation as deterministic visual execution.

Flow:

PROMPT  
↓  
NORMALIZED INTENT  
↓  
SCENE GRAPH  
↓  
TIMELINE  
↓  
ASSET MANIFEST  
↓  
RENDER CONTRACT  
↓  
HTML / REMOTION OUTPUT

## Determinism Guarantees

- Every visual artifact originates from explicit prompt or structured input.
- Normalization captures intent before layout and timing logic.
- Scene graph defines explicit structure and node lineage.
- Timeline maps scene execution to integer frame ranges.
- Asset manifest tracks source, hash, and usage lineage.
- Render contract freezes renderer-facing inputs with hashes.
- No hidden render state and no non-deterministic layout.
