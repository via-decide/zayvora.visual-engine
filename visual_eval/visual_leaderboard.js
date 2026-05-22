export function rankEvaluationResults(results = []) {
  return [...results].sort((a, b) => b.overall_score - a.overall_score);
}

export function createLeaderboardEntry({ request_id, renderer, overall_score, layout_score, timeline_score, determinism_score }) {
  return {
    request_id,
    renderer,
    overall_score,
    layout_score,
    timeline_score,
    determinism_score,
  };
}
