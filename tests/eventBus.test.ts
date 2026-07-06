import { describe, expect, it, vi } from "vitest";
import { EventBus } from "../src/core/events/EventBus";

interface TestEvents extends Record<string, unknown> {
  Ping: { value: number };
  Pong: { text: string };
}

describe("EventBus", () => {
  it("delivers payloads to subscribers of the matching event only", () => {
    const bus = new EventBus<TestEvents>();
    const onPing = vi.fn();
    const onPong = vi.fn();
    bus.on("Ping", onPing);
    bus.on("Pong", onPong);

    bus.emit("Ping", { value: 7 });

    expect(onPing).toHaveBeenCalledTimes(1);
    expect(onPing).toHaveBeenCalledWith({ value: 7 });
    expect(onPong).not.toHaveBeenCalled();
  });

  it("supports multiple listeners and unsubscribe via the returned function", () => {
    const bus = new EventBus<TestEvents>();
    const first = vi.fn();
    const second = vi.fn();
    const unsubscribeFirst = bus.on("Ping", first);
    bus.on("Ping", second);

    unsubscribeFirst();
    bus.emit("Ping", { value: 1 });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    expect(bus.listenerCount("Ping")).toBe(1);
  });

  it("emitting an event with no listeners is a no-op", () => {
    const bus = new EventBus<TestEvents>();
    expect(() => bus.emit("Pong", { text: "silence" })).not.toThrow();
  });
});
