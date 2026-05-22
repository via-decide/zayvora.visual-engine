# Research Brief Generator

The research brief generator creates video-ready, citation-grounded research foundations.

## Primary rule

Research briefs must be video-ready and citation-grounded.

## Output brief format

```json
{
  "brief_id": "BRIEF-001",
  "topic": "",
  "summary": "",
  "key_claims": [],
  "evidence_table": [],
  "contradictions": [],
  "video_angles": [],
  "source_manifest_hash": "sha256:..."
}
```

## Modules

- `briefs/research_brief_generator.js` — orchestrates full brief creation.
- `briefs/brief_schema.js` — canonical brief object + deterministic brief hash.
- `briefs/brief_section_builder.js` — key claims, open questions, video angle sections.
- `briefs/citation_table_builder.js` — evidence/citation table rows.
- `briefs/research_summary_writer.js` — compact narrative summary for producers.

## Included sections

- summary
- key claims
- evidence table
- contradictions
- open questions
- suggested video angles
- source manifest hash linkage

## Success criteria

Nex can produce the research foundation for a YouTube video.
