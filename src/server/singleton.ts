const registry = globalThis as typeof globalThis & { __grudge?: Map<string, unknown> };

/**
 * The worker starts in `instrumentation.ts` and route handlers run in other bundles, so module
 * state is not shared between them. Anything both sides must see lives on `globalThis`.
 */
export function singleton<T>(key: string, create: () => T): T {
  registry.__grudge ??= new Map();
  if (!registry.__grudge.has(key)) registry.__grudge.set(key, create());
  return registry.__grudge.get(key) as T;
}
