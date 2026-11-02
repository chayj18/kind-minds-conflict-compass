import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Round } from "./index";
import { SITUATIONS } from "@/lib/conflict-data";

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
      expect(screen.queryByLabelText("내가 원하는 것")).toBeNull();
    }
  });
  it("keeps step 2 open and alerts for either blank or whitespace-only need", () => {
    setup(); fill(["속상해요", "화나요"]); next();
    for (const values of [["", "쉬고 싶어요"], ["놀고 싶어요", "   "]]) {
      fill(values); next();
      expect(screen.getByRole("alert")).toBeVisible();
      expect(screen.getByLabelText("내가 원하는 것")).toBeVisible();
      expect(screen.queryByRole("region", { name: "내가 적은 감정과 욕구" })).toBeNull();
    }
  });
  it("shows all four entered answers when choosing methods in step 3", () => {
    setup(); fill(["속상해요", "걱정돼요"]); next();
    fill(["잠깐 쉬고 싶어요", "공부를 마치길 바라요"]); next();
    const summary = screen.getByRole("region", { name: "내가 적은 감정과 욕구" });
    for (const answer of ["속상해요", "걱정돼요", "잠깐 쉬고 싶어요", "공부를 마치길 바라요"]) {
      expect(within(summary).getByText(answer, { exact: false })).toBeVisible();
    }
  });
});