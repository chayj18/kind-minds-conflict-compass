import { z } from "zod";

export const answerInputSchema = z.object({
  situationId: z.string(),
  step: z.union([z.literal(1), z.literal(2)]),
  mine: z.string().max(500),
  other: z.string().max(500),
});
export type AnswerInput = z.infer<typeof answerInputSchema>;
export const answerResultSchema = z.object({
  mineHelp: z.string(),
  otherHelp: z.string(),
});
export type AnswerResult = z.infer<typeof answerResultSchema>;

// Only reject unmistakably non-answers locally; meaning is checked in context.
export function simpleAnswerHelp(value: string, step: 1 | 2): string {
  const text = value.trim().normalize("NFKC");
  if (!text) return "빈칸을 채워주세요.";
  if (text.length > 500) return "마음을 짧게 정리해서 적어볼까요?";
  const letters = text.replace(/[^가-힣a-zA-Z]/g, "");
  if (letters.length < 2 || /^(.)\1{2,}$/u.test(letters) || /^(asdf|qwer|test|몰라|모르겠|아무거나|없음)/i.test(text)) {
    return "상황에 적절한 표현이 아니에요. 상황 속에서 느꼈을 감정을 적어볼까요? 위 감정 단어를 참고해도 좋아요";
  }
  return "";
}