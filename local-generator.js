function generate(contract) {
  return contract.files.map(fileName => ({
    name: fileName,
    content: generateContent(fileName)
  }));
}

function generateContent(fileName) {
  if (fileName.endsWith(".md")) {
    return `# Task

Generated task file: ${fileName}

- deterministic
- contract enforced
`;
  }

  throw new Error(`UNSUPPORTED_GENERATION: ${fileName}`);
}

module.exports = { generate };
