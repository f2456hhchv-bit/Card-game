/**
 * Structured logger (AF-001 §9): every entry carries system, level, and data.
 * Keeps a ring buffer so production builds can attach recent history to bug
 * reports; an optional sink mirrors entries (console in dev builds).
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  time: number;
  level: LogLevel;
  system: string;
  message: string;
  data?: unknown;
}

export interface LogOptions {
  capacity?: number;
  sink?: (entry: LogEntry) => void;
  now?: () => number;
}

export class Log {
  private readonly capacity: number;
  private readonly sink: ((entry: LogEntry) => void) | undefined;
  private readonly now: () => number;
  private readonly buffer: LogEntry[] = [];

  constructor(options: LogOptions = {}) {
    this.capacity = options.capacity ?? 500;
    this.sink = options.sink;
    this.now = options.now ?? (() => Date.now());
  }

  debug(system: string, message: string, data?: unknown): void {
    this.write("debug", system, message, data);
  }

  info(system: string, message: string, data?: unknown): void {
    this.write("info", system, message, data);
  }

  warn(system: string, message: string, data?: unknown): void {
    this.write("warn", system, message, data);
  }

  error(system: string, message: string, data?: unknown): void {
    this.write("error", system, message, data);
  }

  entries(): readonly LogEntry[] {
    return this.buffer;
  }

  private write(level: LogLevel, system: string, message: string, data?: unknown): void {
    const entry: LogEntry = data === undefined
      ? { time: this.now(), level, system, message }
      : { time: this.now(), level, system, message, data };
    this.buffer.push(entry);
    if (this.buffer.length > this.capacity) this.buffer.shift();
    this.sink?.(entry);
  }
}
