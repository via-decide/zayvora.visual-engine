import { enforceContract } from './execution-guard.js';
import { writeArtifacts } from './artifact-writer.js';
import { validatePipeline } from './pipeline-validator.js';

export async function run({ engine, input, config = {} }) {
  if (!engine || typeof engine.execute !== 'function') throw new Error('INVALID_ENGINE');
  const generated = await engine.execute(input, config);
  if (config.contract) enforceContract(config.contract, generated);
  const written = writeArtifacts(config.repo || 'local/repo', generated, config.contract);
  if (config.contract) validatePipeline(written, config.contract);
  return { status: 'success', files: written, output: generated };
}
