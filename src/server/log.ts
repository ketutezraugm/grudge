type Level = "info" | "warn" | "error";

function serialize(_key: string, value: unknown): unknown {
  // Drivers wrap the real failure in `cause`; without it a query error says nothing useful.
  if (value instanceof Error) {
    return { name: value.name, message: value.message.slice(0, 200), cause: value.cause };
  }
  if (typeof value === "bigint") return value.toString();
  return value;
}

function write(level: Level, event: string, context: Record<string, unknown> = {}): void {
  const line = JSON.stringify({ t: new Date().toISOString(), level, event, ...context }, serialize);
  process.stdout.write(`${line}\n`);
}

export const log = {
  info: (event: string, context?: Record<string, unknown>) => write("info", event, context),
  warn: (event: string, context?: Record<string, unknown>) => write("warn", event, context),
  error: (event: string, context?: Record<string, unknown>) => write("error", event, context),
};
