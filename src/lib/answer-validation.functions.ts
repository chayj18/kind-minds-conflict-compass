import { createServerFn } from "@tanstack/react-start";
import { answerInputSchema } from "./answer-validation";

export const validateAnswers = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => answerInputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) return { mineHelp: "", otherHelp: "", unavailable: "답변 확인을 준비 중이에요. 잠시 뒤 다시 시도해주세요." };
    const { checkAnswers } = await import("./answer-validation.server");
    return checkAnswers(data, apiKey);
  });