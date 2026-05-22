import crypto from 'node:crypto';

export function stableStringify(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  const keys = Object.keys(value).sort();
  const entries = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
  return `{${entries.join(',')}}`;
}

export function sha256Hash(value) {
  const payload = typeof value === 'string' ? value : stableStringify(value);
  return `sha256:${crypto.createHash('sha256').update(payload).digest('hex')}`;
}
