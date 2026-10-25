import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  SITUATIONS,
  SOLUTIONS,
  CRITERIA,
  GOAL,
  POINTS_PER_ROUND,
  isGoodChoice,
  solutionById,
  type RoundRecord,
  type Situation,
} from "@/lib/conflict-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "갈등관리 연구소 | 갈등 해결 탐구 활동" },
      { name: "description", content: "여러 갈등 상황에서 사과 말고도 다양한 해결 방법을 찾고 골라보는 사회정서교육 활동" },
      { property: "og:title", content: "갈등관리 연구소" },
      { property: "og:description", content: "갈등 상황 속 감정과 욕구를 살피고 알맞은 해결 방법을 골라봐요." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Phase = "intro" | "play" | "done";

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function Index() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [nickname, setNickname] = useState("");
  const [score, setScore] = useState(0);
  const [queue, setQueue] = useState<Situation[]>([]);
  const [idx, setIdx] = useState(0);
  const [records, setRecords] = useState<RoundRecord[]>([]);
  const [lastScore, setLastScore] = useState<number | null>(null);

  useEffect(() => {
    const v = localStorage.getItem("cl-last-score");
    if (v) setLastScore(Number(v));
    const n = localStorage.getItem("cl-nickname");
    if (n) setNickname(n);
  }, []);

  const start = () => {
    localStorage.setItem("cl-nickname", nickname.trim());
    setQueue(shuffle(SITUATIONS));
    setIdx(0);
    setScore(0);
    setRecords([]);
    setPhase("play");
    window.scrollTo(0, 0);
  };

  const finishRound = async (rec: RoundRecord) => {
    const newScore = score + POINTS_PER_ROUND;
    const newRecords = [...records, rec];
    setScore(newScore);
    setRecords(newRecords);
    window.scrollTo(0, 0);
    if (newScore >= GOAL) {
      localStorage.setItem("cl-last-score", String(newScore));
      setPhase("done");
      await supabase.from("activity_results").insert({
        nickname: nickname.trim(),
        score: newScore,
        records: newRecords,
      });
    } else {
      setIdx((i) => i + 1);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-6">
      <header className="mb-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🔬</span>
          <h1 className="text-2xl text-secondary-foreground">갈등관리 연구소</h1>
        </div>
        {phase !== "intro" && <ScoreBadge score={score} />}
      </header>

      {phase === "intro" && (
        <Intro nickname={nickname} setNickname={setNickname} lastScore={lastScore} onStart={start} />
      )}
      {phase === "play" && queue[idx] && (
        <Round
          key={queue[idx].id + idx}
          situation={queue[idx]}
          round={idx + 1}
          score={score}
          onDone={finishRound}
        />
      )}
      {phase === "done" && (
        <Summary nickname={nickname} records={records} onRestart={() => setPhase("intro")} />
      )}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="rounded-full bg-card px-4 py-2 shadow-card">
      <span className="text-sm text-muted-foreground">갈등관리 점수 </span>
      <span className="font-display text-xl text-primary">{score}</span>
      <span className="text-sm text-muted-foreground">/{GOAL}</span>
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl border-2 border-border bg-card p-5 shadow-card ${className}`}>{children}</div>;
}

function PrimaryButton({ children, disabled, onClick, variant = "primary" }: { children: ReactNode; disabled?: boolean; onClick: () => void; variant?: "primary" | "ghost" }) {
  const base = "pop-press rounded-2xl px-6 py-3 text-lg disabled:opacity-40 disabled:pointer-events-none";
  const v = variant === "primary"
    ? "bg-primary text-primary-foreground shadow-pop"
    : "border-2 border-border bg-card text-secondary-foreground";
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={`${base} ${v}`}>
      {children}
    </button>
  );
}

function Intro({ nickname, setNickname, lastScore, onStart }: { nickname: string; setNickname: (v: string) => void; lastScore: number | null; onStart: () => void }) {
  return (
    <div className="space-y-5">
      <Card className="text-center">
        <p className="text-sm text-muted-foreground">나의 갈등관리 점수</p>
        <p className="font-display text-6xl text-primary">{lastScore ?? 0}<span className="text-2xl text-muted-foreground"> 점</span></p>
        <div className="mx-auto mt-3 h-4 max-w-xs overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, lastScore ?? 0)}%` }} />
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-xl text-secondary-foreground">🧪 연구원님, 환영해요!</h2>
        <p className="mb-3 leading-relaxed">
          우리 연구소에는 친구, 가족과의 다양한 <b>갈등 사건</b>이 도착해 있어요. 연구원이 되어 사건을 하나씩 살펴보고 가장 알맞은 해결 방법을 찾아주세요.
        </p>
        <ol className="space-y-2 text-sm">
          {[
            ["1단계", "나와 상대방의 감정 살피기"],
            ["2단계", "나와 상대방이 원하는 것(욕구) 찾기"],
            ["3단계", "해결 방안 3가지 골라 평가하기"],
            ["4단계", "최종 해결 방안 선택하기"],
          ].map(([s, t]) => (
            <li key={s} className="flex items-center gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 font-display text-secondary-foreground">{s}</span>
              {t}
            </li>
          ))}
        </ol>
        <p className="mt-3 rounded-2xl bg-warning-soft p-3 text-sm">알맞은 해결 방안을 고르면 <b>+20점</b>! 100점이 되면 연구 완료예요.</p>
      </Card>

      <Card>
        <label className="mb-2 block font-display text-lg" htmlFor="nick">연구원 닉네임</label>
        <input
          id="nick"
          value={nickname}
          maxLength={20}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="예) 평화지킴이"
          className="mb-4 w-full rounded-2xl border-2 border-input bg-background px-4 py-3 text-lg outline-none focus:border-ring"
        />
        <div className="flex justify-center">
          <PrimaryButton disabled={!nickname.trim()} onClick={onStart}>시작하기 🚀</PrimaryButton>
        </div>
      </Card>
      <p className="text-center text-xs text-muted-foreground">
        <Link to="/teacher" className="underline">선생님 페이지</Link>
      </p>
    </div>
  );
}

function StepBar({ step }: { step: number }) {
  return (
    <div className="mb-4 flex gap-2">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className={`flex-1 rounded-full py-1 text-center font-display text-sm ${n <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          {n}단계
        </div>
      ))}
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1 block font-display">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder={placeholder}
        className="w-full rounded-2xl border-2 border-input bg-background px-4 py-3 outline-none focus:border-ring"
      />
    </label>
  );
}

const FEELINGS = ["속상해요", "억울해요", "화나요", "서운해요", "답답해요", "부끄러워요", "미안해요", "당황스러워요"];

function Round({ situation, round, onDone }: { situation: Situation; round: number; score: number; onDone: (r: RoundRecord) => void }) {
  const [step, setStep] = useState(1);
  const [myFeeling, setMyFeeling] = useState("");
  const [otherFeeling, setOtherFeeling] = useState("");
  const [myNeed, setMyNeed] = useState("");
  const [otherNeed, setOtherNeed] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<string, number[]>>({});
  const [finalId, setFinalId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const togglePick = (id: string) => {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < 3 ? [...p, id] : p));
  };
  const setScore = (id: string, ci: number, v: number) =>
    setScores((s) => {
      const arr = [...(s[id] ?? [0, 0, 0])];
      arr[ci] = v;
      return { ...s, [id]: arr };
    });
  const allScored = picked.length === 3 && picked.every((id) => (scores[id] ?? [0, 0, 0]).every((v) => v > 0));
  const totals = useMemo(() => Object.fromEntries(picked.map((id) => [id, (scores[id] ?? [0, 0, 0]).reduce((a, b) => a + b, 0)])), [picked, scores]);

  const go = (n: number) => { setStep(n); setFeedback(null); window.scrollTo(0, 0); };

  const submitFinal = () => {
    if (!finalId) return;
    const sol = solutionById(finalId);
    if (isGoodChoice(situation, finalId)) {
      setFeedback({ ok: true, msg: `멋져요! "${sol.name}"은(는) 이 상황에서 두 사람 모두를 생각한 좋은 방법이에요. +${POINTS_PER_ROUND}점!` });
    } else {
      const extra = finalId === "apologize"
        ? "사과는 내가 잘못했을 때 꼭 필요한 방법이지만, 이 상황에는 사과만으로 해결되지 않아요. "
        : ["yell", "ignore", "mine"].includes(finalId)
          ? "이 방법은 한 사람의 마음만 생각하거나 관계를 해칠 수 있어요. "
          : "이 방법도 생각해볼 수 있지만, 이 상황에 가장 알맞은 방법은 아니에요. ";
      setFeedback({ ok: false, msg: `${extra}💡 힌트: ${situation.hint}` });
    }
  };

  const confirmNext = () => {
    onDone({
      situationId: situation.id,
      situationTitle: situation.title,
      situationText: situation.text,
      myFeeling, otherFeeling, myNeed, otherNeed,
      candidates: picked.map((id) => ({ id, name: solutionById(id).name, scores: scores[id] ?? [0, 0, 0] })),
      finalId: finalId!,
      finalName: solutionById(finalId!).name,
    });
  };

  return (
    <div className="space-y-4">
      <Card className="border-accent/40">
        <p className="mb-1 font-display text-sm text-accent">사건 파일 #{round}</p>
        <h2 className="mb-2 text-xl">{situation.emoji} {situation.title}</h2>
        <p className="leading-relaxed">{situation.text}</p>
      </Card>

      <StepBar step={step} />

      {step === 1 && (
        <Card className="space-y-4">
          <h3 className="text-lg text-secondary-foreground">1단계 · 감정 살피기 💗</h3>
          <div className="flex flex-wrap gap-2">
            {FEELINGS.map((f) => (
              <span key={f} className="rounded-full bg-muted px-3 py-1 text-sm">{f}</span>
            ))}
          </div>
          <TextArea label="나의 감정" value={myFeeling} onChange={setMyFeeling} placeholder="나는 지금 어떤 기분일까요?" />
          <TextArea label={`${situation.other}의 감정`} value={otherFeeling} onChange={setOtherFeeling} placeholder={`${situation.other}은(는) 어떤 기분일까요?`} />
          <div className="flex justify-end">
            <PrimaryButton disabled={!myFeeling.trim() || !otherFeeling.trim()} onClick={() => go(2)}>다음 →</PrimaryButton>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="space-y-4">
          <h3 className="text-lg text-secondary-foreground">2단계 · 원하는 것(욕구) 찾기 🎯</h3>
          <p className="text-sm text-muted-foreground">감정 뒤에는 "이렇게 되었으면 좋겠다"는 마음이 숨어 있어요.</p>
          <TextArea label="내가 원하는 것" value={myNeed} onChange={setMyNeed} placeholder="나는 ~하고 싶어요" />
          <TextArea label={`${situation.other}이(가) 원하는 것`} value={otherNeed} onChange={setOtherNeed} placeholder={`${situation.other}은(는) ~하고 싶을 거예요`} />
          <div className="flex justify-between">
            <PrimaryButton variant="ghost" onClick={() => go(1)}>← 이전</PrimaryButton>
            <PrimaryButton disabled={!myNeed.trim() || !otherNeed.trim()} onClick={() => go(3)}>다음 →</PrimaryButton>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card className="space-y-4">
          <h3 className="text-lg text-secondary-foreground">3단계 · 해결 방안 후보 3가지 고르고 평가하기 ⚗️</h3>
          <p className="text-sm text-muted-foreground">해결 방안 도감에서 후보 3가지를 골라주세요. ({picked.length}/3)</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SOLUTIONS.map((s) => {
              const on = picked.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => togglePick(s.id)}
                  className={`rounded-2xl border-2 p-3 text-left transition ${on ? "border-primary bg-secondary" : "border-border bg-background"}`}
                >
                  <div className="font-display">{s.emoji} {s.name} {on && "✔"}</div>
                  <div className="font-sans text-xs text-muted-foreground">{s.desc}</div>
                </button>
              );
            })}
          </div>

          {picked.length === 3 && (
            <div className="overflow-x-auto">
              <p className="mb-2 font-display">평가 매트릭스 (1점 아쉬워요 · 2점 괜찮아요 · 3점 아주 좋아요)</p>
              <table className="w-full min-w-[520px] border-separate border-spacing-1 text-sm">
                <thead>
                  <tr>
                    <th className="rounded-xl bg-muted p-2 text-left">해결 방안</th>
                    {CRITERIA.map((c) => (
                      <th key={c.id} className="rounded-xl bg-muted p-2 font-sans font-normal">{c.label}</th>
                    ))}
                    <th className="rounded-xl bg-muted p-2">합계</th>
                  </tr>
                </thead>
                <tbody>
                  {picked.map((id) => {
                    const s = solutionById(id);
                    return (
                      <tr key={id}>
                        <td className="rounded-xl bg-secondary p-2 font-display">{s.emoji} {s.name}</td>
                        {CRITERIA.map((c, ci) => (
                          <td key={c.id} className="rounded-xl bg-background p-1 text-center">
                            <div className="flex justify-center gap-1">
                              {[1, 2, 3].map((v) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => setScore(id, ci, v)}
                                  className={`h-8 w-8 rounded-full border-2 ${(scores[id]?.[ci] ?? 0) === v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}
                                >
                                  {v}
                                </button>
                              ))}
                            </div>
                          </td>
                        ))}
                        <td className="rounded-xl bg-warning-soft p-2 text-center font-display text-lg">{totals[id]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between">
            <PrimaryButton variant="ghost" onClick={() => go(2)}>← 이전</PrimaryButton>
            <PrimaryButton disabled={!allScored} onClick={() => go(4)}>다음 →</PrimaryButton>
          </div>
        </Card>
      )}

      {step === 4 && (
        <Card className="space-y-4">
          <h3 className="text-lg text-secondary-foreground">4단계 · 최종 해결 방안 선택 🏆</h3>
          <p className="text-sm text-muted-foreground">평가 점수를 참고해서 이 상황에 가장 알맞은 방법을 골라주세요.</p>
          <div className="space-y-2">
            {[...picked].sort((a, b) => (totals[b] ?? 0) - (totals[a] ?? 0)).map((id) => {
              const s = solutionById(id);
              const on = finalId === id;
              return (
                <button
                  key={id}
                  type="button"
                  disabled={feedback?.ok}
                  onClick={() => { setFinalId(id); setFeedback(null); }}
                  className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left ${on ? "border-primary bg-secondary" : "border-border bg-background"}`}
                >
                  <span className="font-display text-lg">{s.emoji} {s.name}</span>
                  <span className="rounded-full bg-warning-soft px-3 py-1 text-sm">{totals[id]}점</span>
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`rounded-2xl p-4 leading-relaxed ${feedback.ok ? "bg-success-soft" : "bg-warning-soft"}`}>
              <p className="mb-1 font-display text-lg">{feedback.ok ? "🎉 연구 성공!" : "🤔 다시 생각해 볼까요?"}</p>
              <p>{feedback.msg}</p>
              {!feedback.ok && (
                <p className="mt-2 text-sm text-muted-foreground">후보에 알맞은 방법이 없다면 3단계로 돌아가 후보를 바꿔도 좋아요.</p>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-between gap-2">
            {!feedback?.ok && <PrimaryButton variant="ghost" onClick={() => go(3)}>← 후보 바꾸기</PrimaryButton>}
            {feedback?.ok ? (
              <div className="ml-auto"><PrimaryButton onClick={confirmNext}>다음 사건으로 →</PrimaryButton></div>
            ) : (
              <PrimaryButton disabled={!finalId} onClick={submitFinal}>이 방법으로 결정!</PrimaryButton>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

function Summary({ nickname, records, onRestart }: { nickname: string; records: RoundRecord[]; onRestart: () => void }) {
  return (
    <div className="space-y-5">
      <Card className="text-center">
        <p className="text-5xl">🏅</p>
        <h2 className="mt-2 text-2xl text-primary">{nickname} 연구원, 연구 완료!</h2>
        <p className="mt-1 font-display text-4xl">{GOAL}점</p>
      </Card>

      <Card>
        <h3 className="mb-3 text-xl text-secondary-foreground">📒 오늘의 연구 노트</h3>
        <ul className="space-y-3">
          {records.map((r, i) => (
            <li key={i} className="rounded-2xl bg-background p-3">
              <p className="font-display">#{i + 1} {r.situationTitle}</p>
              <p className="text-sm text-muted-foreground">{r.situationText}</p>
              <p className="mt-1">→ 선택한 해결 방안: <b className="text-primary">{r.finalName}</b></p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h3 className="mb-3 text-xl text-secondary-foreground">🧰 갈등 해결 방법 도감</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SOLUTIONS.filter((s) => !["ignore", "yell", "mine"].includes(s.id)).map((s) => (
            <div key={s.id} className="rounded-2xl bg-secondary p-3">
              <p className="font-display">{s.emoji} {s.name}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-warning-soft">
        <p className="leading-relaxed">
          💌 {nickname} 연구원, 오늘 정말 수고했어요! 갈등이 생겼을 때 <b>사과</b>도 소중하지만, 차례 정하기, 내 마음 말하기, 시간 약속 정하기처럼 <b>여러 가지 방법</b>이 있다는 걸 알게 되었죠?
          앞으로도 다양한 갈등을 만나게 될 거예요. 그럴 때마다 오늘 살펴본 방법들을 떠올리고, 나와 상대방의 마음을 함께 생각하며 <b>대화로</b> 해결해 나가길 응원할게요! 🌱
        </p>
      </Card>

      <div className="flex justify-center">
        <PrimaryButton onClick={onRestart}>처음으로</PrimaryButton>
      </div>
    </div>
  );
}
