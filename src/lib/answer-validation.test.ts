import { describe, expect, it } from "vitest";
import { simpleAnswerHelp } from "./answer-validation";

describe("local non-answer rules", () => {
  it.each([1, 2] as const)("blocks initials and meaningless input in step %s", (step) => {
    for (const value of ["ㄱㄴㄷ", "ㅋㅋㅋ", "가가가", "1234", "asdf"]) {
      expect(simpleAnswerHelp(value, step).length).toBeGreaterThan(0);
    }
  });
  it("leaves positive and mixed emotions to contextual checking", () => {
    for (const value of ["행복하다", "기쁘다", "게임할 때는 기뻤지만 엄마가 화내서 억울했어요"]) {
      expect(simpleAnswerHelp(value, 1)).toBe("");
    }
  });
});