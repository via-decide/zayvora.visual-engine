# Prompt to Video Pipeline

The visual pipeline converts one prompt into one stable render contract.

Flow:

PROMPT
↓
ENRICHED/NORMALIZED INTENT
↓
SCENE GRAPH
↓
TIMELINE
↓
RENDER CONTRACT
↓
HTML / REMOTION ADAPTER OUTPUT

Same prompt + same config produces identical hashes for scene graph, timeline, contract, and output manifest.
