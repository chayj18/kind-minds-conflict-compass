import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkAnswers } from "./answer-validation.server";
import { createResponsesCall } from "./ai/responses.server.ts";

vi.mock("./ai/responses.server.ts", () => ({ createResponsesCall: vi.fn() }));
beforeEach(() => vi.mocked(createResponsesCall).mockReset());

describe("contextual answer check", () => {
  it("rejects local non-answers before sending anything to AI", async () => {
    const result = await checkAnswers({ situationId: "phone", step: 1, mine: "ㄱㄴㄷ", other: "걱정돼요" }, "test-key");
    expect(result.mineHelp.length).toBeGreaterThan(0);
    expect(createResponsesCall).not.toHaveBeenCalled();
  });
  it.each(["행복하다", "기쁘다"])("returns contextual help for %s without sending nicknames", async (mine) => {
    const feedback = { mineHelp: "엄마가 화를 냈을 때 어떤 마음이 들었을까요?", otherHelp: "" };
    vi.mocked(createResponsesCall).mockReturnValue({ result: { output: Promise.resolve(feedback) } } as unknown as ReturnType<typeof createResponsesCall>);
    expect(await checkAnswers({ situationId: "phone", step: 1, mine, other: "걱정돼요" }, "test-key")).toEqual(feedback);
    const call = vi.mocked(createResponsesCall).mock.calls[0];
    expect(call).toBeDefined();
    const payload = JSON.parse(String(call?.[2][0]?.content));
    expect(payload).toEqual({ situation: "학원 다녀와서 계속 공부하고 있었다. 그러다 잠깐 핸드폰을 꺼내 게임을 하고 있었는데 엄마가 공부 안 하냐고 화를 내셨다.", otherPerson: "엄마", step: 1, myAnswer: mine, otherAnswer: "걱정돼요" });
  });
});