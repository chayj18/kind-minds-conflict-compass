import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Round } from "./index";
import { SITUATIONS } from "@/lib/conflict-data";
import { validateAnswers } from "@/lib/answer-validation.functions";
vi.mock("@/lib/answer-validation.functions", () => ({ validateAnswers: vi.fn() }));
beforeEach(() => vi.mocked(validateAnswers).mockReset().mockResolvedValue({ mineHelp: "", otherHelp: "" }));

afterEach(cleanup);

function setup() {
  const situation = SITUATIONS[0];
  if (!situation) throw new Error("A situation is required");
  render(<Round situation={situation} round={1} score={0} onDone={vi.fn()} />);
}
function next() { fireEvent.click(screen.getByRole("button", { name: "다음 →" })); }
function fill(values: string[]) {
  screen.getAllByRole("textbox").forEach((input, i) => fireEvent.change(input, { target: { value: values[i] } }));
}

describe("round input rules", () => {
  it("keeps step 1 open and alerts for either blank or whitespace-only feeling", () => {
    setup();
    for (const values of [["", "화나요"], ["속상해요", "   "]]) {
      fill(values); next();
      expect(screen.getByRole("alert")).toBeVisible();
      expect(screen.getAllByRole("textbox").map((input) => input.getAttribute("aria-invalid"))).toContain("true");
      expect(screen.queryByLabelText("내가 원했던 것")).toBeNull();
    }
  });
  it("keeps step 2 open and alerts for either blank or whitespace-only need", async () => {
    setup(); fill(["속상해요", "화나요"]); next();
    await screen.findByLabelText("내가 원했던 것");
    for (const values of [["", "쉬고 싶어요"], ["놀고 싶어요", "   "]]) {
      fill(values); next();
      expect(screen.getByRole("alert")).toBeVisible();
      expect(screen.getByLabelText("내가 원했던 것")).toBeVisible();
      expect(screen.queryByRole("region", { name: "내가 적은 감정과 욕구" })).toBeNull();
    }
  });
  it("shows all four entered answers when choosing methods in step 3", async () => {
    setup(); fill(["속상해요", "걱정돼요"]); next();
    await screen.findByLabelText("내가 원했던 것");
    fill(["잠깐 쉬고 싶어요", "공부를 마치길 바라요"]); next();
    const summary = await screen.findByRole("region", { name: "내가 적은 감정과 욕구" });
    for (const answer of ["속상해요", "걱정돼요", "잠깐 쉬고 싶어요", "공부를 마치길 바라요"]) {
      expect(within(summary).getByText(answer, { exact: false })).toBeVisible();
    }
  });
  it("rejects initial consonants and meaningless repeated words in step 1", () => {
    setup();
    for (const answer of ["ㄱㄴㄷ", "ㅋㅋㅋ", "가가가", "1234", "asdf"]) {
      fill([answer, "화나요"]); next();
      expect(screen.getByRole("alert")).toBeVisible();
      expect(screen.queryByLabelText("내가 원했던 것")).toBeNull();
    }
    expect(validateAnswers).not.toHaveBeenCalled();
  });
  it("holds unrelated step 1 answers and allows a corrected feeling", async () => {
    vi.mocked(validateAnswers).mockResolvedValueOnce({ mineHelp: "이 사건에서 어떤 기분이 들었을까요?", otherHelp: "" });
    setup(); fill(["바나나", "걱정돼요"]); next();
    await screen.findByRole("alert");
    expect(screen.queryByLabelText("내가 원했던 것")).toBeNull();
    fill(["억울해요", "걱정돼요"]); next();
    expect(await screen.findByLabelText("내가 원했던 것")).toBeVisible();
  });
  it("rejects meaningless step 2 answers without advancing", async () => {
    setup(); fill(["속상해요", "걱정돼요"]); next();
    await screen.findByLabelText("내가 원했던 것");
    fill(["ㄱㄴㄷ", "공부하길 바라요"]); next();
    expect(screen.getByRole("alert")).toBeVisible();
    expect(screen.queryByRole("region", { name: "내가 적은 감정과 욕구" })).toBeNull();
  });
  it("holds a step 2 solution-only answer and allows the underlying need", async () => {
    setup(); fill(["속상해요", "걱정돼요"]); next();
    await screen.findByLabelText("내가 원했던 것");
    vi.mocked(validateAnswers).mockResolvedValueOnce({ mineHelp: "그때 어떤 바람이 있었나요?", otherHelp: "" });
    fill(["사과한다", "공부하길 바라요"]); next();
    await screen.findByRole("alert");
    expect(screen.queryByRole("region", { name: "내가 적은 감정과 욕구" })).toBeNull();
    fill(["잠깐 쉬고 싶어요", "공부하길 바라요"]); next();
    expect(await screen.findByRole("region", { name: "내가 적은 감정과 욕구" })).toBeVisible();
  });
  it("does not advance when checking is unavailable and preserves input", async () => {
    vi.mocked(validateAnswers).mockResolvedValueOnce({ mineHelp: "", otherHelp: "", unavailable: "연결 오류" });
    setup(); fill(["속상해요", "걱정돼요"]); next();
    await screen.findByRole("alert");
    expect(screen.getByLabelText("나의 감정")).toHaveValue("속상해요");
    expect(screen.queryByLabelText("내가 원했던 것")).toBeNull();
    expect(screen.getByRole("button", { name: "다음 →" })).toBeEnabled();
  });
  it.each(["행복하다", "기쁘다"])("holds contextually unsuitable emotion %s and allows a corrected answer", async (answer) => {
    vi.mocked(validateAnswers).mockResolvedValueOnce({ mineHelp: "엄마가 화를 냈을 때 어떤 마음이 들었을까요?", otherHelp: "" });
    setup(); fill([answer, "걱정돼요"]); next();
    await screen.findByRole("alert");
    expect(screen.getByLabelText("나의 감정")).toHaveValue(answer);
    expect(screen.queryByLabelText("내가 원했던 것")).toBeNull();
    expect(validateAnswers).toHaveBeenCalledWith({ data: { situationId: "phone", step: 1, mine: answer, other: "걱정돼요" } });
    fill(["엄마가 화내서 억울해요", "걱정돼요"]); next();
    expect(await screen.findByLabelText("내가 원했던 것")).toBeVisible();
  });
  it("holds an unsuitable other-person emotion independently", async () => {
    vi.mocked(validateAnswers).mockResolvedValueOnce({ mineHelp: "", otherHelp: "엄마는 왜 화를 내셨을까요?" });
    setup(); fill(["억울해요", "기쁘다"]); next();
    await screen.findByRole("alert");
    expect(screen.getByLabelText("엄마의 감정")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("나의 감정")).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByLabelText("내가 원했던 것")).toBeNull();
  });
  it("accepts a contextual mixed feeling without a local positive-emotion ban", async () => {
    setup(); fill(["게임할 때는 기뻤지만 엄마가 화내서 억울했어요", "걱정돼요"]); next();
    expect(await screen.findByLabelText("내가 원했던 것")).toBeVisible();
  });
  it("holds feelings-only answers in the needs step", async () => {
    setup(); fill(["억울해요", "걱정돼요"]); next();
    await screen.findByLabelText("내가 원했던 것");
    vi.mocked(validateAnswers).mockResolvedValueOnce({ mineHelp: "그때 무엇을 바랐나요?", otherHelp: "" });
    fill(["행복하다", "공부를 마치길 바라요"]); next();
    await screen.findByRole("alert");
    expect(screen.queryByRole("region", { name: "내가 적은 감정과 욕구" })).toBeNull();
  });
});