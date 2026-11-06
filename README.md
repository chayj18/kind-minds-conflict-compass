# Kind Minds Conflict Compass

초등학교 4학년 학생들이 사회정서교육의 일환으로, 주어진 가상의 갈등 상황에서 적절한 갈등 해결 방안을 탐구하는 활동을 할 수 있는 웹앱을 만들어줘. 이 웹앱의 숨겨진 목표는 학생들이 갈등 상황에서 '사과' 외에 다양한 갈등 해결 방안이 있음을 알고, 상황에 맞게 검토하여 적절한 것을 선택하는 역량을 기르게 돕는 거야.
제목: 갈등관리 연구소 
[초기 화면] 나의 갈등관리 점수, 활동 소개, [시작하기] 버튼, 닉네임 입력창

[상황 예시] 이외에도 초등학생이 일상생활에서 겪을 만한 현실적인 다양한 갈등상황을 제시 (일방적인 폭력 상황, 범죄 등은 제외하기)
-학원 다녀와서 계속 공부하고 있었다. 그러다 잠깐 핸드폰을 꺼내 게임을 하고 있었는데 엄마가 공부 안하냐고 화를 내셨다.
-친구가 실수로 말을 더듬은 것이 우스워서 따라 하며 말했다. 그러자 친구가 화를 냈다.
-선생님이 모둠별로 수정테이프를 2개씩 나누어주셨다. 그런데 4명이 동시에 사용하고 싶어한다.
-쉬는시간에 나는 책을 읽고 있었다. 그런데 친구가 계속 말을 걸로 장난을 친다. 처음에는 적당히 대답해주었지만 이제는 책을 읽는 데 집중하고 싶다.
[1단계] 나의 감정과 상대방의 감정 쓰기 
[2단계] 내가 원하는 것(욕구)와 상대방이 원하는 것(욕구) 쓰기 
[3단계] 해결 방안 후보 3가지를 적고, 평가하기 (1~3점)
-평가 매트릭스의 형태로 세로열은 해결 방안 3가지, 가로열은 평가 기준  
-해결방안 전체 리스트 중에 3가지를 선택하는 형태  
-평가기준은 두 사람의 욕구를 모두 고려했는지, 서로의 관계를 지킬 수 있는 방법인지, 실제로 실천할 수 있는 방법인지 
[4단계] 최종 해결 방안 선택 
적절한 해결 방안을 선택할 때마다 갈등관리 점수가 20점씩 올라가고 다음 상황으로 넘어감. 적절하지 않은 경우 안내/도움 메시지와 함께 넘어가지 않음

100점에 도달하면 종료되며, 오늘 살펴본 상황과 학생이 선택한 해결 방안을 요약하여 출력. 또한 해결 방안 전체 리스트를 보여주며 앞으로도 여러 갈등 상황을 마주하겠지만 오늘 살펴본 방법들을 잘 기억하고, 상대방과의 대화를 통해 해결해나가기를 응원한다는 등의 따뜻한 메시지로 마무리. 

교사에게는 활동이 종료된 경우 닉네임, 점수, 학생이 겪은 상황과 선택한 해결방안이 공유됨

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kind-minds-conflict-compass.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4445bbc1-87d9-44e9-9be3-0b70e3f13403).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
