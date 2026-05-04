function stableHash(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function generateContent(fileName, constraints = {}, variation = null) {
  if (fileName.endsWith('.md')) return `# Task\n\nGenerated task file: ${fileName}\n\n- deterministic\n- contract enforced\n`;
  if (fileName.endsWith('.png')) {
    const payload = `${fileName}|${JSON.stringify(variation || {})}|${JSON.stringify(constraints)}`;
    return `PNG_SIM:${stableHash(payload)}:${constraints.resolution || 1024}`;
  }
  throw new Error(`UNSUPPORTED_GENERATION: ${fileName}`);
}

export async function execute(plan) {
  const { files = [], constraints = {}, variation = null } = plan || {};
  return files.map(fileName => ({ name: fileName, content: generateContent(fileName, constraints, variation) }));
}
