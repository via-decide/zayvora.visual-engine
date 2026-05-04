const { stableHash } = require('./core/variation-engine');

function generate(contract, variation = null) {
  const files = contract.files.map(fileName => ({
    name: fileName,
    content: generateContent(fileName, contract.constraints, variation)
  }));
  contract.validateConstraints(files.length);
  return files;
}

function generateContent(fileName, constraints = {}, variation = null) {
  if (fileName.endsWith('.md')) {
    return `# Task\n\nGenerated task file: ${fileName}\n\n- deterministic\n- contract enforced\n`;
  }

  if (fileName.endsWith('.png')) {
    const payload = `${fileName}|${JSON.stringify(variation || {})}|${JSON.stringify(constraints)}`;
    return `PNG_SIM:${stableHash(payload)}:${constraints.resolution || 1024}`;
  }

  throw new Error(`UNSUPPORTED_GENERATION: ${fileName}`);
}

module.exports = { generate };
