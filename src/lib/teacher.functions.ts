import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getTeacherResults = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ passcode: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }) => {
    const expected = process.env["TEACHER_PASSCODE"];
    if (!expected || data.passcode !== expected) {
      return { ok: false as const, rows: [] };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("activity_results")
      .select("id, nickname, score, records, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      console.error(error);
      throw new Error("결과를 불러오지 못했어요.");
    }
    return { ok: true as const, rows: rows ?? [] };
  });
