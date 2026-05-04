import fs from 'node:fs';
import path from 'node:path';

function normalizePath(repo, fileName) {
  return path.join('artifacts', repo.replace('/', '/'), fileName);
}

export function writeArtifacts(repo, files, contract) {
  const written = [];
  for (const file of files) {
    if (contract && !contract.isValidFile(file.name)) throw new Error(`WRITE_BLOCKED: ${file.name}`);
    const fullPath = normalizePath(repo, file.name);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, file.content, 'utf-8');
    if (!fs.existsSync(fullPath)) throw new Error(`WRITE_FAILED: ${fullPath}`);
    written.push(fullPath);
  }
  return written;
}
