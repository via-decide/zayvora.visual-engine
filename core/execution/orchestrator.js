import { enforceContract } from './execution-guard.js';
import { writeArtifacts } from './artifact-writer.js';
import { validatePipeline } from './pipeline-validator.js';
import * as localEngine from './engines/local-engine.js';

export async function run({ engine, input, config = {}, repo, contract } = {}) {
  const effectiveConfig = { ...config, repo: repo || config.repo, contract: contract || config.contract };
  const runtimeEngine = engine && typeof engine.execute === 'function' ? engine : localEngine;
  if (!runtimeEngine || typeof runtimeEngine.execute !== 'function') throw new Error('INVALID_ENGINE');
  const generated = await runtimeEngine.execute(input || { files: effectiveConfig.contract?.files || [], constraints: effectiveConfig.contract?.constraints || {} }, effectiveConfig);
  if (effectiveConfig.contract) enforceContract(effectiveConfig.contract, generated);
  const written = writeArtifacts(effectiveConfig.repo || 'local/repo', generated, effectiveConfig.contract);
  if (effectiveConfig.contract) validatePipeline(written, effectiveConfig.contract);
  return { status: 'success', files: written, output: generated };
}
