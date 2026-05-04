const { generate } = require('./local-generator');
const { enforceContract } = require('./execution-guard');
const { writeArtifacts } = require('./artifact-writer');
const { validatePipeline } = require('./pipeline-validator');

const { normalizePromptSpec } = require('./core/prompt-spec');
const { generateVariations, stableHash } = require('./core/variation-engine');
const { planExecution } = require('./core/execution-planner');
const { runBatch } = require('./core/batch-runner');
const { buildPDF } = require('./core/pdf-builder');

async function run({ repo, contract }) {
  if (!contract || !contract.files.length) {
    throw new Error('INVALID_CONTRACT');
  }

  const generated = generate(contract);
  enforceContract(contract, generated);

  const written = writeArtifacts(repo, generated, contract);
  validatePipeline(written, contract);

  return {
    status: 'success',
    files: written
  };
}

function generateVisual(promptSpec) {
  const spec = normalizePromptSpec(promptSpec);
  const flowId = `flow_${stableHash(JSON.stringify(spec))}`;
  const variations = generateVariations(spec, { maxCombinations: spec.constraints.max_images });
  const plan = planExecution(variations);
  const results = runBatch(plan);
  const pdfPath = buildPDF(flowId, spec, results);
  return { flowId, results, pdfPath };
}

module.exports = { run, generate: generateVisual };
