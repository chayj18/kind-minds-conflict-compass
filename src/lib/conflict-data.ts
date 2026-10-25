export type Solution = { id: string; emoji: string; name: string; desc: string };

export const SOLUTIONS: Solution[] = [
  { id: "apologize", emoji: "🙏", name: "사과하기", desc: "내 잘못을 인정하고 진심으로 미안하다고 말해요." },
  { id: "imessage", emoji: "💬", name: "내 마음 말하기", desc: "\"나는 ~해서 ~한 기분이야\"처럼 차분하게 내 마음을 전해요." },
  { id: "listen", emoji: "👂", name: "상대방 이야기 들어보기", desc: "상대방이 왜 그랬는지 끝까지 들어봐요." },
  { id: "turns", emoji: "🔄", name: "차례 정하기", desc: "순서를 정해서 돌아가며 해요." },
  { id: "share", emoji: "🤝", name: "나누어 함께 쓰기", desc: "물건이나 공간을 나누어 같이 사용해요." },
  { id: "compromise", emoji: "⚖️", name: "서로 조금씩 양보하기", desc: "둘 다 조금씩 양보해서 중간 지점을 찾아요." },
  { id: "time", emoji: "⏰", name: "시간 약속 정하기", desc: "언제, 얼마 동안 할지 함께 약속해요." },
  { id: "later", emoji: "🧊", name: "잠시 진정 후 다시 이야기하기", desc: "마음이 가라앉은 뒤에 다시 대화해요." },
  { id: "rule", emoji: "📋", name: "함께 규칙 만들기", desc: "다음에도 지킬 수 있는 규칙을 같이 정해요." },
  { id: "alternative", emoji: "💡", name: "다른 방법 찾기", desc: "둘 다 원하는 것을 얻을 새로운 방법을 생각해요." },
  { id: "help", emoji: "🧑‍🏫", name: "어른께 도움 요청하기", desc: "스스로 해결이 어려우면 선생님이나 부모님께 도움을 구해요." },
  { id: "rps", emoji: "✊", name: "가위바위보로 정하기", desc: "공평한 방법으로 빠르게 정해요." },
];

export type Situation = {
  id: string;
  title: string;
  emoji: string;
  text: string;
  other: string;
  good: string[];
  hint: string;
};

export const SITUATIONS: Situation[] = [
  {
    id: "phone",
    title: "공부 중 잠깐 게임",
    emoji: "📱",
    text: "학원 다녀와서 계속 공부하고 있었다. 그러다 잠깐 핸드폰을 꺼내 게임을 하고 있었는데 엄마가 공부 안 하냐고 화를 내셨다.",
    other: "엄마",
    good: ["imessage", "listen", "time", "rule", "later", "compromise"],
    hint: "나는 열심히 공부하다 쉬고 싶었고, 엄마는 내가 공부를 잘하길 바라셨어요. 내 상황을 차분히 설명하거나 쉬는 시간을 함께 약속하는 방법은 어떨까요?",
  },
  {
    id: "stutter",
    title: "말 더듬은 친구 따라 하기",
    emoji: "🗣️",
    text: "친구가 실수로 말을 더듬은 것이 우스워서 따라 하며 말했다. 그러자 친구가 화를 냈다.",
    other: "친구",
    good: ["apologize", "listen", "rule"],
    hint: "이 상황은 내 행동이 친구의 마음을 아프게 했어요. 이럴 때는 무엇이 먼저 필요할까요?",
  },
  {
    id: "tape",
    title: "수정테이프 2개, 친구 4명",
    emoji: "✏️",
    text: "선생님이 모둠별로 수정테이프를 2개씩 나누어주셨다. 그런데 4명이 동시에 사용하고 싶어한다.",
    other: "모둠 친구들",
    good: ["turns", "share", "rule", "rps", "compromise", "alternative"],
    hint: "누구의 잘못도 아닌 상황이에요. 사과보다는 모두가 공평하게 쓸 수 있는 방법이 필요해요!",
  },
  {
    id: "book",
    title: "책 읽고 싶은 쉬는 시간",
    emoji: "📖",
    text: "쉬는 시간에 나는 책을 읽고 있었다. 그런데 친구가 계속 말을 걸며 장난을 친다. 처음에는 적당히 대답해주었지만 이제는 책 읽는 데 집중하고 싶다.",
    other: "친구",
    good: ["imessage", "time", "compromise", "alternative"],
    hint: "친구는 나와 놀고 싶고, 나는 책에 집중하고 싶어요. 내 마음을 부드럽게 전하거나, 함께 놀 시간을 따로 정해보면 어떨까요?",
  },
  {
    id: "tv",
    title: "리모컨 쟁탈전",
    emoji: "📺",
    text: "저녁에 내가 좋아하는 만화를 보려는데, 동생도 같은 시간에 다른 프로그램을 보고 싶다고 리모컨을 가져갔다.",
    other: "동생",
    good: ["turns", "time", "compromise", "rule", "alternative", "rps"],
    hint: "둘 다 보고 싶은 게 있어요. 순서나 시간을 정하는 방법이 둘 다의 욕구를 채워줄 수 있어요.",
  },
  {
    id: "team",
    title: "피구 팀 나누기",
    emoji: "⚽",
    text: "체육 시간에 피구 팀을 나누는데, 친한 친구와 서로 다른 팀이 되자 친구가 팀을 바꿔 달라고 떼를 쓴다. 다른 친구들은 이미 정한 대로 하자고 한다.",
    other: "친구",
    good: ["listen", "imessage", "rule", "alternative", "compromise"],
    hint: "친구는 함께하고 싶고, 다른 친구들은 정한 약속을 지키고 싶어요. 친구 마음을 들어주고, 다음 판에 같은 팀이 되는 방법도 있지 않을까요?",
  },
  {
    id: "secret",
    title: "비밀을 말해버린 친구",
    emoji: "🤫",
    text: "친한 친구에게만 말한 비밀을 그 친구가 다른 친구에게 말해버렸다. 너무 속상하고 서운하다.",
    other: "친구",
    good: ["imessage", "later", "listen", "rule"],
    hint: "서운한 마음이 클 때는 바로 화내기보다 마음을 가라앉히고, 내 기분을 솔직하게 전하는 것이 관계를 지키는 데 도움이 돼요.",
  },
  {
    id: "seat",
    title: "창가 자리 다툼",
    emoji: "🚌",
    text: "현장체험학습 버스에서 짝과 나 둘 다 창가 자리에 앉고 싶어한다.",
    other: "짝",
    good: ["turns", "compromise", "rps", "time", "alternative"],
    hint: "누가 잘못한 상황이 아니에요. 갈 때와 올 때 번갈아 앉는 것처럼 공평한 방법을 찾아볼까요?",
  },
];

export const CRITERIA = [
  { id: "needs", label: "두 사람의 욕구를 모두 고려했나요?" },
  { id: "relation", label: "서로의 관계를 지킬 수 있나요?" },
  { id: "doable", label: "실제로 실천할 수 있나요?" },
] as const;

export type RoundRecord = {
  situationId: string;
  situationTitle: string;
  situationText: string;
  myFeeling: string;
  otherFeeling: string;
  myNeed: string;
  otherNeed: string;
  candidates: { id: string; name: string; scores: number[] }[];
  finalId: string;
  finalName: string;
};

export const solutionById = (id: string) => SOLUTIONS.find((s) => s.id === id)!;
export const isGoodChoice = (situation: Situation, solutionId: string) =>
  situation.good.includes(solutionId);
export const POINTS_PER_ROUND = 20;
export const GOAL = 100;
