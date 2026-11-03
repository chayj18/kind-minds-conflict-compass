import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getTeacherResults } from "@/lib/teacher.functions";
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
  const [passcode, setPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const load = async (code = passcode) => {
    setLoading(true);
    setError("");
    try {
      const res = await getTeacherResults({ data: { passcode: code } });
      if (!res.ok) { setError("비밀번호가 맞지 않아요."); setUnlocked(false); return; }
      setUnlocked(true);
      setRows(res.rows as unknown as Row[]);
    } catch {
      setError("결과를 불러오지 못했어요. 잠시 뒤 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (!unlocked) {
    return (
      <div className="mx-auto min-h-screen max-w-md px-4 py-10">
        <h1 className="mb-4 text-2xl text-secondary-foreground">🧑‍🏫 선생님 페이지</h1>
        <form onSubmit={(e) => { e.preventDefault(); if (passcode.trim()) load(); }} className="space-y-3">
          <label className="block text-sm" htmlFor="teacher-passcode">선생님 비밀번호</label>
          <input id="teacher-passcode" type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} className="w-full rounded-2xl border-2 border-border bg-card px-3 py-2" />
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={loading} className="rounded-2xl bg-primary px-4 py-2 text-primary-foreground">{loading ? "확인 중..." : "결과 보기"}</button>
        </form>
        <Link to="/" className="mt-6 inline-block text-sm underline">활동 화면</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl text-secondary-foreground">🧑‍🏫 선생님 페이지</h1>
        <div className="flex gap-3 text-sm">
          <button type="button" onClick={() => load()} className="underline">새로고침</button>
          <Link to="/" className="underline">활동 화면</Link>
        </div>
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
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
