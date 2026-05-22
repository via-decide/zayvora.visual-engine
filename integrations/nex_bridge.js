import { parseNexOutput, extractCitations } from './nex_parser.js';
import { normalizeNexResearch, claimsToVideoBeats } from './nex_normalizer.js';
import { mapNexToEcosystemContract } from './nex_contract_mapper.js';
import { VisualGenerationEngine } from '../engine/visual_generation_engine.js';

export function buildPromptFromBeats(title, beats) {
  const lines = [title, ...beats.map((beat) => `${beat.title}: ${beat.narrative}`)];
  return lines.join('\n');
}

export function nexResearchToVideoContract(nexOutput, options = {}) {
  const parsed = parseNexOutput(nexOutput);
  const normalized = normalizeNexResearch(parsed);
  const citations = extractCitations(parsed);
  const beats = claimsToVideoBeats(normalized);

  const prompt = buildPromptFromBeats(normalized.title, beats);
  const engine = new VisualGenerationEngine({
    renderer: options.target ?? 'remotion',
    dimensions: options.dimensions ?? { width: 1920, height: 1080 },
    fps: options.fps ?? 30,
    format: options.format ?? 'mp4',
    request_id: normalized.request_id,
  });

  const run = engine.generateFromPrompt(prompt, { target: options.target ?? 'remotion' });

  const ecosystemContract = mapNexToEcosystemContract({
    normalized,
    beats,
    citations,
    render_contract: run.render_contract,
  });

  return {
    parsed,
    normalized,
    beats,
    citations,
    prompt,
    run,
    ecosystem_contract: ecosystemContract,
    deterministic: true,
  };
}
