import { describe, expect, it } from "vitest";
import { roundPoints, STEP_HINTS } from "./step-hints";
import { SITUATIONS } from "./conflict-data";
describe("hint scoring", () => {
  it("gives 20 points without hints", () => expect(roundPoints(0)).toBe(20));
  it("subtracts 5 points per hint", () => expect(roundPoints(2)).toBe(10));
  it("never goes below 0", () => expect(roundPoints(6)).toBe(0));
  it("has two-level hints for every situation", () => {
    for (const s of SITUATIONS) expect(STEP_HINTS[s.id]?.solution).toHaveLength(2);
  });
});
