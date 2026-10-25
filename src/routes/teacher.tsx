import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RoundRecord } from "@/lib/conflict-data";

export const Route = createFileRoute("/teacher")({
  head: () => ({
    meta: [
      { title: "선생님 페이지 | 갈등관리 연구소" },
      { name: "description", content: "학생들의 갈등관리 활동 결과를 확인하는 페이지" },
      { property: "og:title", content: "선생님 페이지 | 갈등관리 연구소" },
      { property: "og:description", content: "학생별 점수와 상황, 선택한 해결 방안을 확인해요." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Teacher,
});

type Row = { id: string; nickname: string; score: number; records: RoundRecord[]; created_at: string };

function Teacher() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const load = async () => {
    const { data } = await supabase.from("activity_results").select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as unknown as Row[]);
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl text-secondary-foreground">🧑‍🏫 선생님 페이지</h1>
        <div className="flex gap-3 text-sm">
          <button type="button" onClick={load} className="underline">새로고침</button>
          <Link to="/" className="underline">활동 화면</Link>
        </div>
      </div>
      {rows === null && <p>불러오는 중...</p>}
      {rows?.length === 0 && <p className="text-muted-foreground">아직 활동을 마친 학생이 없어요.</p>}
      <div className="space-y-4">
        {rows?.map((r) => (
          <details key={r.id} className="rounded-3xl border-2 border-border bg-card p-4 shadow-card">
            <summary className="flex cursor-pointer items-center justify-between font-display text-lg">
              <span>{r.nickname}</span>
              <span className="text-primary">{r.score}점 · <span className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleString("ko-KR")}</span></span>
            </summary>
            <ul className="mt-3 space-y-3">
              {r.records.map((rec, i) => (
                <li key={i} className="rounded-2xl bg-background p-3 text-sm">
                  <p className="font-display text-base">#{i + 1} {rec.situationTitle}</p>
                  <p>감정: 나 「{rec.myFeeling}」 / 상대 「{rec.otherFeeling}」</p>
                  <p>욕구: 나 「{rec.myNeed}」 / 상대 「{rec.otherNeed}」</p>
                  <p>후보: {rec.candidates.map((c) => `${c.name}(${c.scores.join("·")})`).join(", ")}</p>
                  <p>최종 선택: <b className="text-primary">{rec.finalName}</b></p>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
