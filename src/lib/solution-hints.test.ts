import { describe, expect, it } from "vitest";
import { SITUATIONS, SOLUTIONS } from "./conflict-data";
import { SOLUTION_HINTS } from "./solution-hints";

describe("situation method examples", () => {
  it("supplies a spoken hint for every method, including unsuitable methods", () => {
    expect(SITUATIONS.length).toBe(8);
    expect(SOLUTIONS.length).toBe(12);
    for (const situation of SITUATIONS) {
      const hints = SOLUTION_HINTS[situation.id];
      expect(Object.keys(hints ?? {}).sort()).toEqual(SOLUTIONS.map((s) => s.id).sort());
      for (const solution of SOLUTIONS) {
        expect((hints?.[solution.id] ?? "").trim().length).toBeGreaterThan(0);
      }
    }
  });
});