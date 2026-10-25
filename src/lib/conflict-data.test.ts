import { describe, it, expect } from "vitest";
import { SITUATIONS, isGoodChoice, POINTS_PER_ROUND, GOAL } from "./conflict-data";

describe("conflict rules", () => {
  it("each good choice adds 20 points and 100 ends the activity", () => {
    expect(POINTS_PER_ROUND).toBe(20);
    expect(GOAL / POINTS_PER_ROUND).toBe(5);
    expect(SITUATIONS.length).toBeGreaterThanOrEqual(5);
  });
  it("apology is not appropriate for sharing two correction tapes among four", () => {
    const tape = SITUATIONS.find((s) => s.id === "tape")!;
    expect(isGoodChoice(tape, "apologize")).toBe(false);
    expect(isGoodChoice(tape, "turns")).toBe(true);
  });
  it("yelling is never appropriate", () => {
    for (const s of SITUATIONS) expect(isGoodChoice(s, "yell")).toBe(false);
  });
});
