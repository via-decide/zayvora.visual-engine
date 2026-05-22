export class SearchProviderRegistry {
  constructor() {
    this.providers = new Map();
  }

  registerProvider(name, provider) {
    if (!name || typeof provider?.search !== 'function') {
      throw new Error('Provider must include a name and async search(query, context) function.');
    }
    this.providers.set(name, provider);
  }

  listProviders() {
    return [...this.providers.keys()];
  }

  async queryAll(query, context = {}) {
    const entries = [...this.providers.entries()];
    const settled = await Promise.allSettled(
      entries.map(async ([name, provider]) => {
        const result = await provider.search(query, context);
        return { name, result: Array.isArray(result) ? result : [] };
      }),
    );

    return settled.flatMap((entry) => {
      if (entry.status !== 'fulfilled') return [];
      return entry.value.result.map((item) => ({ ...item, provider: entry.value.name }));
    });
  }
}
