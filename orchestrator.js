const { generate } = require("./local-generator");
const { enforceContract } = require("../core/execution-guard");
const { writeArtifacts } = require("../core/artifact-writer");
const { validatePipeline } = require("../core/pipeline-validator");

async function run({ repo, contract }) {
  if (!contract || !contract.files.length) {
    throw new Error("INVALID_CONTRACT");
  }

  const generated = generate(contract);
  enforceContract(contract, generated);

  const written = writeArtifacts(repo, generated, contract);
  validatePipeline(written, contract);

  return {
    status: "success",
    files: written
  };
}

module.exports = { run };
