export function parseNexOutput(nexOutput = {}) {
  return {
    request_id: nexOutput.request_id ?? 'NEX-REQUEST-001',
    title: nexOutput.title ?? '',
    claims: Array.isArray(nexOutput.claims) ? nexOutput.claims : [],
    sources: Array.isArray(nexOutput.sources) ? nexOutput.sources : [],
    sections: Array.isArray(nexOutput.sections) ? nexOutput.sections : [],
    raw: nexOutput,
  };
}

export function extractCitations(parsed) {
  return (parsed.sources ?? []).map((source, index) => ({
    citation_id: source.citation_id ?? `CIT-${String(index + 1).padStart(3, '0')}`,
    title: source.title ?? 'Untitled Source',
    url: source.url ?? '',
  }));
}
