# 2주차: 공이 떨어지고 튀는 원리

## 오늘 해볼 일

오늘은 Canvas 위에서 공을 움직여 봅니다. 공의 위치와 속도를 직접 바꾸고, 바닥에 닿으면 방향을 바꾸게 만들 거예요. 마지막에는 공마다 다른 중력을 주고, 공끼리 만났는지도 찾아봅니다.

- 움직임을 만드는 `update → draw → 반복`의 흐름을 설명할 수 있어요.
- 중력이 속도를 바꾸고, 속도가 위치를 바꾸는 코드를 써 볼 수 있어요.
- 공이 여러 개일 때 충돌을 직접 찾는 일이 왜 번거로운지 알 수 있어요.

## 시작: 지난 시간 기억 꺼내기

화면에 그림을 한 번 그린 뒤 멈추면 공은 움직이는 것처럼 보일까요? 지난 시간의 애니메이션 실습을 떠올리고, 오른쪽 단서를 보고 왼쪽 질문에 답해 보세요.

| 질문 | 힌트 |
|---|---|
| 1초 동안 화면 그림을 몇 번 바꾸는지 나타내는 말은? | ‘초당 몇 번?’을 뜻하는 표현과 그 영문 약자를 떠올려 보세요. |
| 화면을 그릴 때 브라우저가 다음 그림 시점을 알려 주는 함수는? | 지난 시간 애니메이션 코드에서 브라우저에 다음 그리기 시점을 요청하던 줄을 떠올려 보세요. |
| 코드로 그림을 그리는 도화지 역할을 하는 HTML 요소는? | 도형과 선을 픽셀로 그리기 위해 HTML에 추가했던 요소를 떠올려 보세요. |

## 왜 직접 만들어 볼까요?

게임에서는 공이 떨어지고, 벽에 부딪히고, 다른 물체와 만납니다. 오늘은 그중 간단한 움직임을 직접 만들어 봅니다. 다음 시간에는 Matter.js가 이런 계산을 어떻게 대신하는지 비교할 거예요.

## 핵심 개념

### 1. 계산하고, 그리기를 반복해요

> **정의:** 게임 루프는 움직임을 계산하고 화면에 그리는 일을 계속 반복하는 구조예요.
>
> `update() → draw() → 다음 프레임 예약`

`update()`에서는 공의 위치를 바꾸고, `draw()`에서는 바뀐 위치에 공을 그립니다. 이 두 일을 `requestAnimationFrame`으로 계속 이어 주면 움직임이 됩니다.

![움직임 계산, 화면에 그리기, 다음 프레임 예약을 이어 반복하는 게임 루프](/lessons/matterjs-game/diagrams/game-loop.svg)

### 2. 속도가 위치를 바꿔요

> **정의:** 위치는 물체가 있는 곳이고, 속도는 한 프레임 동안 얼마나 어느 쪽으로 움직이는지예요.
>
> `새 위치 = 현재 위치 + 속도`

예를 들어 공이 `x = 100`에 있고 `vx = 5`라면 다음 프레임에는 `x = 105`가 됩니다. Canvas의 y 좌표는 아래쪽으로 갈수록 커져요.

![x가 100인 공이 오른쪽 속도 5만큼 움직여 x가 105인 위치에 도착하는 모습](/lessons/matterjs-game/diagrams/position-velocity.svg)

### 3. 중력은 아래쪽 속도를 키워요

> **정의:** 이 실습에서는 매 프레임 아래쪽 속도에 중력 값을 더해 떨어지는 모습을 만들어요.
>
> `속도에 중력 더하기 → 속도만큼 위치 이동`

`vy += gravity`를 먼저 하고 `y += vy`를 하면 공이 아래로 움직일수록 점점 빨라집니다. 여기서 `gravity`는 실제 행성의 중력값이 아니라 움직임을 비교하기 위한 게임 속 숫자예요.

![매 프레임 중력을 더할수록 아래쪽 속도와 이동 거리가 커지는 모습](/lessons/matterjs-game/diagrams/gravity-speed.svg)

### 4. 바닥에 닿으면 방향을 바꿔요

> **정의:** 튕김은 속도의 방향을 반대로 바꾸고, 남길 비율만큼 속도를 줄이는 거예요.
>
> `vy = -vy × 튕김 비율`

`vy`가 양수일 때는 아래로, 음수일 때는 위로 움직여요. 바닥에서 `vy`의 부호를 바꾸면 공이 위로 튀고, `0.8`을 곱하면 튀어 오른 뒤 속도가 줄어듭니다.

![공이 바닥에 닿은 뒤 방향을 바꾸고 더 짧은 속도로 튀어 오르는 모습](/lessons/matterjs-game/diagrams/bounce.svg)

## 함께 만들기: 공 하나를 떨어뜨려요

아래 코드를 실행해 공이 어떻게 움직이는지 살펴보세요. 먼저 `GRAVITY`를 `0.2`로 바꾸면 어떤 차이가 날지 예상한 뒤 실행해 봅니다.

```html playground title="공 하나를 떨어뜨리고 튕기기" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>튕기는 공</title>
  <style>
    body { margin: 0; display: grid; place-items: center; min-height: 100vh; background: #f0f4f8; }
    canvas { max-width: 100%; height: auto; background: white; border: 2px solid #333; }
  </style>
</head>
<body>
  <canvas id="game" width="600" height="400"></canvas>
  <script>
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    const ball = { x: 300, y: 50, vy: 0, r: 20, color: "tomato" };
    const GRAVITY = 0.5;
    const BOUNCE = 0.8;

    function update() {
      ball.vy += GRAVITY;
      ball.y += ball.vy;

      if (ball.y + ball.r > canvas.height) {
        ball.y = canvas.height - ball.r;
        ball.vy = -ball.vy * BOUNCE;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>
```

### 실행하고 관찰하기

1. **▶ 실행**을 누르고 공이 떨어지는 모습을 봅니다.
2. `GRAVITY`를 `0.2`, `1`로 바꿔 실행하고 차이를 말해 봅니다.
3. `BOUNCE`를 `0.3`으로 바꾸면 튀는 높이가 어떻게 달라질까요?
4. 바닥에 닿았을 때 `ball.y`를 바닥 위로 옮기는 줄을 잠시 지우면 어떤 일이 생기나요?

**↺ 초기화**를 누르면 코드는 처음 상태로 돌아가고 미리보기도 처음부터 다시 실행됩니다.

내 컴퓨터에서 실행하려면 VS Code에서 `index.html` 파일을 만들고 코드를 붙여 넣은 뒤 Live Server의 **Go Live**를 눌러도 됩니다.

## 미션 A: 중력이 다른 공 세 개 만들기

공마다 중력을 다르게 주면 움직임도 달라질까요? 아래 코드에서 `// ✏️ 바꿔 보기`라고 표시한 부분을 수정해 실험해 보세요.

- 공 세 개의 `gravity` 값을 서로 다르게 정하세요.
- 각 공의 색과 이름을 다르게 해 화면에서 구분하세요.
- 값이 클수록 어떤 움직임이 나타나는지 말해 보세요.

**완료했나요?** 공 세 개가 서로 다른 움직임을 보이고, 내가 정한 값을 한 문장으로 설명하면 성공입니다. 수치는 실제 행성의 중력이 아니라 비교를 위한 게임 값입니다.

```html playground title="미션 A: 공마다 중력 바꾸기" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>중력 실험</title>
  <style>
    body { margin: 0; display: grid; place-items: center; min-height: 100vh; background: #f0f4f8; }
    canvas { max-width: 100%; height: auto; background: white; border: 2px solid #333; }
  </style>
</head>
<body>
  <canvas id="game" width="600" height="400"></canvas>
  <script>
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    const BOUNCE = 0.8;
    const balls = [
      // ✏️ gravity, color, name 값을 바꿔 보세요.
      { x: 120, y: 50, vy: 0, r: 20, gravity: 0.15, color: "gray", name: "A" },
      { x: 300, y: 50, vy: 0, r: 20, gravity: 0.5, color: "dodgerblue", name: "B" },
      { x: 480, y: 50, vy: 0, r: 20, gravity: 1.2, color: "tomato", name: "C" },
    ];

    function update() {
      for (const ball of balls) {
        ball.vy += ball.gravity;
        ball.y += ball.vy;
        if (ball.y + ball.r > canvas.height) {
          ball.y = canvas.height - ball.r;
          ball.vy = -ball.vy * BOUNCE;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const ball of balls) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(ball.name, ball.x - 4, ball.y - ball.r - 8);
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>
```

## 도전 미션: 공이 만났는지 찾아내기

지금까지 만든 공은 서로 겹쳐도 그대로 지나가요. 두 공의 중심 사이 거리가 두 반지름의 합보다 작으면 공이 겹친 상태입니다.

아래 코드의 `// ✏️ 여기에 충돌 확인 코드를 써 보세요` 자리에 조건문을 작성하세요. 두 공이 **처음 겹친 프레임에만** 콘솔에 `부딪혔다!`를 출력하면 됩니다. 실행한 뒤 브라우저 개발자 도구의 Console을 확인하세요.


> 힌트 보기
>
> - `Math.hypot(dx, dy)`는 두 점 사이의 거리를 구합니다.
> - 겹친 동안 매 프레임 출력되지 않게 하려면 이전 프레임의 상태를 어떻게 기억할까요?

```html playground title="도전: 두 공이 만난 순간 찾기" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>공의 만남 찾기</title>
  <style>
    body { margin: 0; display: grid; place-items: center; min-height: 100vh; background: #f0f4f8; }
    canvas { max-width: 100%; height: auto; background: white; border: 2px solid #333; }
  </style>
</head>
<body>
  <canvas id="game" width="600" height="400"></canvas>
  <script>
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    const balls = [
      { x: 100, y: 100, vx: 2, vy: 0, r: 24, color: "tomato" },
      { x: 500, y: 100, vx: -2, vy: 0, r: 24, color: "dodgerblue" },
    ];
    let wasTouching = false;

    function update() {
      for (const ball of balls) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.vx *= -1;
      }

      const [a, b] = balls;
      // ✏️ 여기에 충돌 확인 코드를 써 보세요.
      // 두 공 사이 거리는 Math.hypot(a.x - b.x, a.y - b.y)로 구할 수 있어요.
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const ball of balls) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>
```

## 오늘 배운 것 정리하기

- 공이 떨어질수록 빨라지는 것은 어떤 값을 계속 바꾸기 때문인가요?
- 바닥에 닿았을 때 공이 튀어 오르게 하는 코드는 무엇을 바꾸나요?
- 공이 두 개일 때 충돌을 확인하는 것과 공이 많을 때 확인하는 것은 어떻게 다를까요?

다음 시간에는 오늘 직접 작성한 위치·속도·튕김 계산을 Matter.js가 어떻게 대신하는지 살펴봅니다.

## 교사용 메모 (학생에게는 숨김)

- 수업 흐름 예시(100분): 복습 10분, 개념과 함께 만들기 40분, 쉬는 시간, 미션 A 25분, 도전 미션과 정리 25분.
- 도전 미션의 충돌 판정은 `const distance = Math.hypot(a.x - b.x, a.y - b.y);`, `const touching = distance < a.r + b.r;`로 계산한다. `touching && !wasTouching`일 때 출력하고 마지막에 `wasTouching = touching`으로 상태를 저장한다.
- 학생이 막히면 먼저 중심 사이 거리와 반지름의 합을 그림으로 비교하게 한다. 출력이 반복되면 “바로 전 프레임에도 겹쳐 있었는지”를 기억하도록 안내한다.
- 이 단순 모델은 프레임 수에 따라 움직임이 달라질 수 있다. 수업 목표를 위해 시간 보정은 구현하지 않는다.
