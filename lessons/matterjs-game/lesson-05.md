# 5주차: 부딪히면 무슨 일이 일어날까요?

## 오늘 해볼 일

지난주에는 물체마다 성질(`isStatic`, `friction`, `restitution` 같은 값)을 정해 움직임을 다르게 만들었어요. 그런데 물체들이 서로 **부딪혀도** 코드는 그 사실을 전혀 몰랐어요. 오늘은 Matter.js가 "지금 A와 B가 부딪혔어요!" 하고 알려 주는 **충돌 이벤트**를 받아서, 부딪힌 물체를 없애고 점수를 올리는 미니 게임 규칙을 만들어 봅니다. 게임을 하려면 공을 내 손으로 움직여야 하니, 키보드로 공을 움직이고 점프시키는 방법도 처음 배워요.

- 이벤트(`Events.on`)가 "무언가 일어났을 때 실행되는 코드"라는 것을 설명할 수 있어요.
- 키보드(`keydown`/`keyup`)와 `Body.setVelocity`로 공을 움직이고 점프시킬 수 있어요.
- 충돌 이벤트(`collisionStart`)로 "물체 두 개가 부딪힌 순간"을 코드에서 알아챌 수 있어요.
- `label`(이름표)로 부딪힌 물체가 누구인지 구분하고, `World.remove`로 물체를 없앨 수 있어요.
- 점수(`score`)와 게임 상태(`gameState`) 변수로 규칙을 코드로 표현하고, 닿으면 사라지는 물체와 게임오버 조건을 설계할 수 있어요.

**오늘 수업 순서 (100분)**

| 시간 | 할 일 |
|---|---|
| 전반 50분 | 지난주 복습·시작·왜(7분) → 개념 알아보기(10분) → 함께 만들기 단계 1~5(33분) |
| 쉬는 시간 | |
| 후반 50분 | 단계 6 실행·관찰(10분) → 미션 A(25분) → 정리(10분) → 여유 시간(5분, 미션 B 시작) |

미션 B는 시간이 남을 때(0~15분) 해요. 도전 미션은 선택 과제예요.

## 시작: 성질을 정해 준 물체들이 부딪히면 어떻게 될까?

먼저 4주차를 떠올려 볼게요. 아래 질문에 한 줄씩 답해 보세요.

1. `isStatic: true`인 물체는 부딪혀도 어떻게 되나요? 바닥과 벽에 왜 이걸 썼나요?
2. 통통 튀는 공을 만들고 싶으면 `friction`, `restitution`, `density`, `frictionAir` 중 무엇을 바꿔야 하나요?
3. 원, 사각형, 다각형은 각각 어떤 함수로 만들었나요? `angle`은 어떤 단위의 값이었나요?

4주차에서 우리는 공이 얼마나 잘 튀고 미끄러지는지를 정했어요. 그런데 공이 바닥이나 상자에 **부딪히는 순간** 무슨 일이 일어난다고 해도, 지금 코드는 그걸 알지 못해요. 눈으로만 볼 뿐이에요. 오늘은 부딪힌 순간을 코드가 **알아채게** 해 봅니다.

게임을 떠올려 볼까요?

- 동전에 닿으면 동전이 사라지고 점수가 올라가요.
- 가시에 닿으면 게임오버가 돼요.
- 땅에 닿아 있을 때만 점프할 수 있어요.

이 모든 게임의 공통점은 "A가 B에 **닿았을 때** 무언가 일어난다"예요.

## 왜 충돌을 알아내야 할까요?

지금까지 Matter.js는 닿은 물체끼리 튕기고 밀어내는 계산을 **알아서** 해 줬어요. 그런데 그 결과를 보기만 하면 "게임"이 되지 않아요. 점수, 아이템, 게임오버처럼 **규칙**이 있어야 게임이 돼요. 규칙은 거의 다 "무엇이 무엇에 닿았을 때 → 어떻게 할까"의 모양이에요.

그래서 Matter.js는 물체가 닿는 순간 "방금 이 둘이 부딪혔어요" 하고 우리 코드에 소식을 전해 줘요. 우리는 그 소식을 받아서 규칙을 쓰기만 하면 돼요. 이것은 6주차 Constraint와 7주차 기획으로 가는 길목이고, 8주차부터의 게임 제작에서 점수와 게임오버를 직접 구현하는 데 바로 쓰여요.

> 이번에도 약속이에요. 점수와 속도 숫자는 **게임을 설계하는 값**이에요. 과학 시간에 배우는 단위와 같다고 보지 않고, 숫자를 바꿔서 눈으로 비교하는 데 집중해요.

## 핵심 개념

### 이벤트 — Events.on

> **정의:** 이벤트는 **무언가 일어났을 때 실행되는 코드**예요. "이런 일이 일어나면 이 코드를 실행해 줘" 하고 미리 등록해 두는 거예요.
>
> `Events.on(engine, "beforeUpdate", () => { ... })`

HTML/JS에서 버튼을 눌렀을 때 실행되는 코드(`addEventListener("click", ...)`)와 같은 생각이에요. 일이 일어나기를 기다렸다가, 일어난 순간에 실행돼요. Matter.js에서는 `Events.on(대상, "이벤트 이름", 함수)`로 등록해요. 오늘은 이벤트 이름 네 가지를 만나요.

| 이벤트 이름 | 언제 실행되나요? |
|---|---|
| `"beforeUpdate"` | 계산이 갱신되기 **직전마다** (1초에 약 60번) |
| `"afterRender"` | 화면이 그려진 **직후마다** |
| `"collisionStart"` | 물체 두 개가 **막 닿기 시작한 순간** (아래에서 자세히) |
| `"collisionEnd"` | 닿아 있던 두 물체가 **떨어지는 순간** (아래에서 자세히) |

`afterRender`는 화면 위에 글자를 쓸 때 써요. 이미 그려진 화면 위에 덧그리는 거예요. 4주차 코드에서 화면에 글자를 쓸 때 이미 본 `Events.on(render, "afterRender", …)` 줄이 바로 이거예요.

```js
Events.on(render, "afterRender", () => {
  render.context.fillText("점수: 3", 20, 36);   // 캔버스에 글자 쓰기
});
```

`beforeUpdate`는 "매번 확인하고 싶은 것"이 있을 때 써요. 아래 키보드 조작에서 바로 쓰여요.

### 키보드 입력 — keydown, keyup, keys

> **정의:** `keydown`은 키를 **눌렀을 때**, `keyup`은 키에서 **손을 뗐을 때** 오는 이벤트예요. 지금 누르고 있는 키를 `keys` 객체에 기억해 두고 쓰면 편해요.
>
> `window.addEventListener("keydown", (e) => { keys[e.code] = true; });`

키를 누른 순간에 공을 한 번만 움직이면 끊겨 보여요. 그래서 이렇게 해요.

1. `keydown`이 오면 `keys["ArrowRight"] = true`처럼 **누르고 있다고 적어 둬요.**
2. `keyup`이 오면 `keys["ArrowRight"] = false`로 **뗐다고 적어 둬요.**
3. `beforeUpdate`(1초에 약 60번)에서 `if (keys["ArrowRight"]) { ... }`로 **매번 확인**하고 움직여요.

`e.code`는 키 이름이에요. `"ArrowLeft"`, `"ArrowRight"`, `"Space"`처럼 쓰고, 이름 철자는 대소문자까지 맞아야 해요.

### 공 움직이게 하기 — Body.setVelocity

> **정의:** `Body.setVelocity`는 물체의 **속도를 내가 정한 값으로 바꾸는** 함수예요. `x`는 좌우, `y`는 위아래 속도예요.
>
> `Body.setVelocity(ball, { x: 4, y: ball.velocity.y })`

4주차 단계 2에서 공을 밀 때 써 봤어요. 오늘은 키보드로 공을 움직이고 점프시킬 때 써요. `y`는 음수가 위쪽이라 점프는 `-10` 같은 음수를 넣어요.

### 충돌 이벤트 — collisionStart

> **정의:** 충돌 이벤트(`collisionStart`)는 물체 두 개가 **막 닿기 시작한 순간**에 Matter.js가 우리 코드에 보내 주는 알림이에요.
>
> `Events.on(engine, "collisionStart", (event) => { ... })`

`beforeUpdate`는 매번 실행되지만, `collisionStart`는 **물체가 닿는 순간에만** 한 번 실행돼요. 닿고 있는 동안 계속 실행되는 게 아니에요.

비유하면 현관 초인종이에요. 누가 **누르는 순간** 한 번 "딩동" 하고 울려요. 손가락을 누르고 있는 내내 울리지 않아요.

알림 안에는 `event.pairs`라는 **짝 목록**이 들어 있어요. 같은 순간에 부딪힌 짝이 여러 개일 수 있어서 배열이에요. 짝마다 부딪힌 두 물체가 `bodyA`, `bodyB`로 들어 있어요.

```js
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((pair) => {
    // pair.bodyA 와 pair.bodyB 가 방금 부딪힌 두 물체
  });
});
```

닿은 물체가 서로 **떨어지는 순간**을 알려 주는 짝꿍 이벤트도 있어요.

> **정의:** `collisionEnd`는 닿아 있던 두 물체가 **떨어지는 순간**에 오는 알림이에요.
>
> `Events.on(engine, "collisionEnd", (event) => { ... })`

`event.pairs`를 쓰는 방법은 `collisionStart`와 똑같아요. 이 짝꿍은 단계 5에서 "땅에서 떨어졌다"를 알아낼 때 써요.

이때 `bodyA`와 `bodyB` 중 **누가 누구인지는 정해져 있지 않아요**. 공이 `bodyA`일 수도 있고 `bodyB`일 수도 있어요. 그래서 다음 개념이 필요해요.

### 이름표 — label

> **정의:** `label`은 물체에 붙이는 **이름표(문자열)**예요. 부딪힌 물체가 누구인지 이름표로 구분해요.
>
> `Bodies.circle(100, 100, 20, { label: "ball" })`

물체를 만들 때 옵션에 `label`을 적어 두면 나중에 `body.label`로 읽을 수 있어요. 이름은 내가 자유롭게 지어요. (이름표를 안 붙이면 기본값이 들어가 있어서 구분이 안 돼요.) 오늘은 이런 이름을 써요.

| label | 누구? |
|---|---|
| `"ball"` | 내가 조작하는 공 |
| `"target"` | 맞히면 점수를 주는 목표물 |
| `"ground"` | 땅(바닥) |
| `"box"` | 올라가 볼 상자 (단계 4·5) |
| `"coin"` | 1점짜리 동전 (단계 6) |
| `"gold"` | 3점짜리 보너스 동전 (단계 6) |
| `"spike"` | 닿으면 위험한 가시 (단계 6부터) |

그러면 "공과 목표물이 부딪혔나?"는 이렇게 물어요. `bodyA`가 공이고 `bodyB`가 목표물이거나, 반대이거나, 두 경우를 모두 확인해야 해요.

```js
const labels = [pair.bodyA.label, pair.bodyB.label];
if (labels.includes("ball") && labels.includes("target")) {
  // 공과 목표물이 부딪혔다!
}
```

`labels.includes("ball")`은 "배열 안에 `"ball"`이 들어 있나요?"라는 뜻이에요.

### 물체 없애기 — World.remove

> **정의:** `World.remove`는 월드에서 물체를 **빼는** 함수예요. 월드에서 빠진 물체는 화면에서도 사라지고 더 이상 부딪히지도 않아요.
>
> `World.remove(engine.world, body)`

`World.add`의 반대라고 생각하면 돼요. 동전을 먹으면 사라지는 효과가 바로 이거예요. 어떤 물체를 없앨지는 `pair.bodyA`나 `pair.bodyB`로 알 수 있으니, 이름표로 "목표물 쪽"을 골라서 없애요.

"목표물 쪽을 고르는" 한 줄에는 **삼항 연산자**가 나와요. `조건 ? A : B`는 "조건이 맞으면 A, 아니면 B"라는 뜻이에요. 예를 들어 `pair.bodyA.label === "target" ? pair.bodyA : pair.bodyB`는 "`bodyA`가 목표물이면 `bodyA`, 아니면 `bodyB`"예요. 또 `targets.filter(...)`는 "조건에 맞는 것만 남긴 새 목록"을 만들어 줘요. 없앤 목표물을 목록에서 빼는 데 써요.

한 가지 조심할 점이 있어요. 같은 순간에 같은 목표물이 두 번 알림에 나타날 수 있어요. 그러면 점수가 두 번 오르기도 해요. 그래서 점수를 올리기 전에 "이미 없앴는지" 확인하는 습관을 들여요. (단계 3에서 직접 확인해 봐요.)

### 점수와 상태 변수

> **정의:** 상태 변수는 게임의 **지금 상황을 기억하는 변수**예요. 점수(`score`)와 게임 상태(`gameState`)가 대표적이에요.
>
> `let score = 0;` / `let gameState = "playing";`

점수는 숫자 변수예요. 목표물을 맞히면 `score += 1`로 올려요. 게임 상태는 문자열 변수로, `"playing"`(하는 중)과 `"gameover"`(끝남) 같은 값을 가져요. 규칙은 이렇게 써요.

```js
if (gameState !== "playing") return;   // 게임이 끝났으면 아무것도 하지 않아요
```

HTML/JS 시간에 변수에 값을 저장해 두고 필요할 때 읽던 것과 똑같아요. 다른 점은, 값을 바꾸는 시점이 "버튼을 눌렀을 때"가 아니라 "물체가 부딪혔을 때"라는 것뿐이에요.

점수와 상태는 화면에 보여 줘야 플레이어가 알 수 있어요. 앞에서 배운 `afterRender`로 캔버스에 글자를 쓰는 방법을 써요.

### 통과하는 물체 — isSensor

> **정의:** `isSensor: true`인 물체는 닿았다는 알림은 오지만 **부딪혀 튕기지 않고 통과**해요.
>
> `Bodies.circle(250, 325, 10, { isStatic: true, isSensor: true })`

동전은 "먹는 물건"이라 공이 튕겨 나가면 이상해요. 그래서 닿았다는 알림(`collisionStart`)만 받고, 공은 그대로 지나가게 해요. 단계 6과 미션 A에서 써요.

## 함께 만들기: 부딪히면 점수가 오르는 미니 데모

아래 여섯 단계를 차례로 실행해요. 코드를 읽기 전에 먼저 예측을 적어 보세요.

### 단계 1 — 부딪힌 순간 알아채기

공 하나가 떨어져서 바닥과 상자에 부딪혀요. 부딪힐 때마다 화면의 숫자가 올라가요. 아직 누구랑 부딪혔는지는 구분하지 않아요.

```reflection title="단계 1 실행 전 예측"
1. 공이 바닥에 처음 떨어졌을 때 숫자는 몇 번 올라갈까요? 공이 여러 번 튕기면요?
2. 공이 바닥 위에서 가만히 멈춰 있는 동안에도 숫자가 계속 올라갈까요?
3. 부딪힌 순간 숫자가 한 번에 2씩 오르는 일이 생길 수 있을까요? 왜 그럴까요?
```

```html playground title="단계 1 — collisionStart로 부딪힌 횟수 세기" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>단계 1: 부딪힌 횟수 세기</title>
  <style>
    html, body { margin: 0; min-height: 100%; background: #eef3ed; font-family: sans-serif; }
    body { display: flex; flex-direction: column; align-items: center; }
    canvas { display: block; max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js"></script>
  <script>
    const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

    const width = 800;
    const height = 450;
    const engine = Engine.create();

    const render = Render.create({
      element: document.body,
      engine,
      options: { width, height, wireframes: false, background: "#eef3ed" },
    });

    const ground = Bodies.rectangle(width / 2, height - 20, width, 40, {
      isStatic: true,
      render: { fillStyle: "#586b4d" },
    });
    const leftWall = Bodies.rectangle(0, height / 2, 30, height, {
      isStatic: true,
      render: { visible: false },
    });
    const rightWall = Bodies.rectangle(width, height / 2, 30, height, {
      isStatic: true,
      render: { visible: false },
    });
    const box = Bodies.rectangle(520, height - 70, 80, 60, {
      isStatic: true,
      render: { fillStyle: "#4f82a8" },
    });
    const ball = Bodies.circle(250, 60, 22, {
      restitution: 0.7,   // 잘 튕기는 공
      render: { fillStyle: "#d66b45" },
    });
    Body.setVelocity(ball, { x: 4, y: 0 });   // 오른쪽으로 살짝 굴러가요

    World.add(engine.world, [ground, leftWall, rightWall, box, ball]);

    // 부딪힌 횟수를 기억하는 변수
    let hitCount = 0;

    // 두 물체가 막 닿기 시작한 순간에만 실행돼요
    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        hitCount += 1;   // 부딪힌 짝 하나마다 1씩 올려요
      });
    });

    // 화면에 숫자 쓰기
    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.fillStyle = "#333";
      ctx.font = "20px sans-serif";
      ctx.fillText("부딪힌 횟수: " + hitCount, 20, 36);
    });

    Render.run(render);
    Runner.run(Runner.create(), engine);
  </script>
</body>
</html>
```

### 단계 2 — label로 누구와 부딪혔는지 구분하기

단계 1 장면에 이름표를 붙여요. 단계 1의 상자는 치웠어요. 공(`"ball"`), 땅(`"ground"`), 목표물(`"target"`)을 만들고, **공과 목표물이 부딪힌 경우만** 화면에 기록해요. 땅에 부딪히는 건 무시해요. `[[520, 385], …].map(([x, y]) => …)`는 좌표 목록에서 하나씩 꺼내 같은 모양의 상자를 만들고, 새 목록으로 돌려줘요. `...targets`는 목록 안의 물체들을 하나씩 꺼내 `World.add` 목록에 펼쳐 넣는 표시예요.

```reflection title="단계 2 실행 전 예측"
1. 공이 땅에만 부딪히면 숫자가 올라갈까요?
2. 공이 목표물에 부딪히면 bodyA가 공일지 bodyB가 공일지 알 수 있나요? 그래서 어떻게 확인하면 좋을까요?
3. 목표물끼리 부딪히는 일이 생기면 숫자가 올라갈까요?
```

```html playground title="단계 2 — label로 공과 목표물 구분하기" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>단계 2: label로 구분하기</title>
  <style>
    html, body { margin: 0; min-height: 100%; background: #eef3ed; font-family: sans-serif; }
    body { display: flex; flex-direction: column; align-items: center; }
    canvas { display: block; max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js"></script>
  <script>
    const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

    const width = 800;
    const height = 450;
    const engine = Engine.create();

    const render = Render.create({
      element: document.body,
      engine,
      options: { width, height, wireframes: false, background: "#eef3ed" },
    });

    const ground = Bodies.rectangle(width / 2, height - 20, width, 40, {
      isStatic: true,
      label: "ground",   // ★ 땅의 이름표
      render: { fillStyle: "#586b4d" },
    });
    const leftWall = Bodies.rectangle(0, height / 2, 30, height, {
      isStatic: true,
      render: { visible: false },
    });
    const rightWall = Bodies.rectangle(width, height / 2, 30, height, {
      isStatic: true,
      render: { visible: false },
    });
    const ball = Bodies.circle(120, 100, 22, {   // ★ 시작 위치
      restitution: 0.5,   // ★ 덜 튕기게
      label: "ball",   // ★ 공의 이름표
      render: { fillStyle: "#d66b45" },
    });
    Body.setVelocity(ball, { x: 10, y: 0 });   // ★ 목표물 쪽으로 빠르게 굴러가요

    // ★ 목표물 3개: 2개는 쌓여 있고 1개는 옆에 있어요 (이 블록 전체가 새로 생겼어요)
    const targets = [[520, 385], [520, 335], [600, 385]].map(([x, y]) =>
      Bodies.rectangle(x, y, 50, 50, {
        label: "target",
        render: { fillStyle: "#e7b84b" },
      })
    );

    World.add(engine.world, [ground, leftWall, rightWall, ball, ...targets]);   // ★

    let hitCount = 0;   // ★ 공이 목표물에 부딪힌 횟수

    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];   // ★ 두 이름표를 배열로 모아요
        if (labels.includes("ball") && labels.includes("target")) {   // ★ 순서는 상관없어요
          hitCount += 1;   // ★
        }
      });
    });

    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.fillStyle = "#333";
      ctx.font = "20px sans-serif";
      ctx.fillText("공이 목표물에 부딪힌 횟수: " + hitCount, 20, 36);   // ★
    });

    Render.run(render);
    Runner.run(Runner.create(), engine);
  </script>
</body>
</html>
```

### 단계 3 — 맞힌 목표물 없애고 점수 올리기

단계 2에서 이어져요. 공은 단계 2처럼 시작할 때 `Body.setVelocity`로 오른쪽으로 굴러가요. 이번에는 목표물 3개가 바닥에 `isStatic`으로 고정되어 있어요. 공은 가장 가까운 목표물에 부딪히고 튕겨 돌아와서, 한 번 굴릴 때마다 목표물을 하나씩 맞혀요. 공이 목표물에 닿으면 `World.remove`로 없애고 `score`를 올려요. 화면 위쪽에는 점수가 보여요.

화면 위의 **"다시 굴리기"** 버튼을 누르면 공이 처음 자리로 돌아가 다시 굴러가요. 목표물과 점수는 그대로라서, 버튼을 누를 때마다 남은 목표물을 하나씩 마저 맞힐 수 있어요. 버튼 안에서는 `Body.setPosition`과 `Body.setVelocity`를 써요. `Body.setAngularVelocity(ball, 0)`로 구르던 회전도 멈춰요.

> **정의:** `Body.setPosition`은 물체를 **내가 정한 자리로 바로 옮기는** 함수예요.
>
> `Body.setPosition(ball, { x: 120, y: 338 })`

```reflection title="단계 3 실행 전 예측"
1. 공이 목표물을 맞히면 무슨 일이 일어날까요? 점수는 몇 점 오를까요?
2. 목표물을 다 맞힌 뒤 "다시 굴리기"를 누르면 점수가 또 오를까요? 왜 그럴까요?
3. 목표물을 없애기 전에 "이미 없앴는지" 확인하지 않으면 어떤 문제가 생길 수 있을까요?
```

```html playground title="단계 3 — 목표물 제거와 score 증가" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>단계 3: 목표물 제거와 score 증가</title>
  <style>
    html, body { margin: 0; min-height: 100%; background: #eef3ed; font-family: sans-serif; }
    body { display: flex; flex-direction: column; align-items: center; }
    canvas { display: block; max-width: 100%; height: auto; }
    .bar { height: 50px; display: flex; align-items: center; gap: 8px; }   /* ★ */
    button { font-size: 16px; padding: 6px 14px; }   /* ★ */
  </style>
</head>
<body>
  <div class="bar"><button id="roll">다시 굴리기</button></div>   <!-- ★ -->
  <script src="https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js"></script>
  <script>
    const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

    const width = 800;
    const height = 400;   // ★ 버튼 자리를 위해 조금 낮춰요
    const engine = Engine.create();

    const render = Render.create({
      element: document.body,
      engine,
      options: { width, height, wireframes: false, background: "#eef3ed" },
    });

    const ground = Bodies.rectangle(width / 2, height - 20, width, 40, {
      isStatic: true,
      label: "ground",
      render: { fillStyle: "#586b4d" },
    });
    const leftWall = Bodies.rectangle(0, height / 2, 30, height, {
      isStatic: true,
      render: { visible: false },
    });
    const rightWall = Bodies.rectangle(width, height / 2, 30, height, {
      isStatic: true,
      render: { visible: false },
    });
    const ball = Bodies.circle(120, 338, 22, {   // ★ 땅 위에서 시작
      restitution: 0.5,
      friction: 0.01,   // ★ 잘 미끄러지게
      frictionAir: 0,   // ★ 공기 저항 없음
      label: "ball",
      render: { fillStyle: "#d66b45" },
    });
    Body.setVelocity(ball, { x: 10, y: 0 });   // 목표물 쪽으로 빠르게 굴러가요

    // ★ 목표물 3개: 바닥 위에 고정해 둬요 (isStatic이라 밀려나지 않아요)
    let targets = [[380, 338], [520, 338], [660, 338]].map(([x, y]) =>   // ★ 나중에 목록에서 빼야 해서 let
      Bodies.rectangle(x, y, 44, 44, {   // ★ 좌표와 크기
        isStatic: true,   // ★
        label: "target",
        render: { fillStyle: "#e7b84b" },
      })
    );

    World.add(engine.world, [ground, leftWall, rightWall, ball, ...targets]);

    let score = 0;   // ★ 점수

    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (labels.includes("ball") && labels.includes("target")) {
          // ★ 목표물을 골라 없애고 점수를 올려요 (이 블록 전체가 새로 생겼어요)
          const target = pair.bodyA.label === "target" ? pair.bodyA : pair.bodyB;   // 두 물체 중 목표물 쪽을 골라요
          if (!targets.includes(target)) return;   // 이미 없앤 목표물이면 아무것도 하지 않아요
          targets = targets.filter((t) => t !== target);   // 없앤 목표물은 목록에서도 빼요
          World.remove(engine.world, target);   // 월드에서 없애기
          score += 1;
        }
      });
    });

    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.fillStyle = "#333";
      ctx.font = "20px sans-serif";
      ctx.fillText("점수: " + score, 20, 36);   // ★
    });

    // ★ 다시 굴리기 버튼 (이 블록 전체가 새로 생겼어요)
    const rollButton = document.getElementById("roll");
    rollButton.addEventListener("click", () => {   // 버튼을 누르면 이 함수가 실행돼요
      Body.setPosition(ball, { x: 120, y: 338 });   // setPosition: 공을 처음 자리로 바로 옮겨요
      Body.setVelocity(ball, { x: 10, y: 0 });      // 다시 오른쪽으로 굴려요
      Body.setAngularVelocity(ball, 0);             // 회전 속도를 0으로: 구르던 회전을 멈춰요
      rollButton.blur();   // 버튼에서 초점을 빼요 (스페이스바가 버튼을 또 누르지 않게)
    });

    Render.run(render);
    Runner.run(Runner.create(), engine);
  </script>
</body>
</html>
```

### 단계 4 — 키보드로 공 움직이고 점프하기

이번 장면은 단계 1~3과 이어지지 않는 새 장면이에요. 방향키 좌우로 공이 움직이고, 스페이스바(Space)로 점프해요. 공은 `keydown`/`keyup`으로 `keys` 객체에 눌린 키를 기억하고, `beforeUpdate`에서 매번 확인해 `Body.setVelocity`로 움직여요. 그런데 이 장면에는 **일부러 땅 확인이 없어요.** 점프를 계속 눌러 보며 어떤 일이 생기는지 관찰하세요.

```reflection title="단계 4 실행 전 예측"
1. 공이 공중에 떠 있을 때 스페이스바를 또 누르면 어떻게 될까요?
2. 스페이스바를 누르고 있으면 공은 어디까지 올라갈 수 있을까요? 게임이라면 이게 괜찮을까요?
3. 단계 1~3에서는 공이 시작할 때(단계 3은 버튼을 눌렀을 때도) 정해 준 속도로만 움직였어요. 키보드로 움직일 때는 코드가 "언제" 키를 확인할까요?
```

```html playground title="단계 4 — 키보드로 공 움직이고 점프하기 (땅 확인 없음)" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>단계 4: 키보드로 움직이고 점프하기</title>
  <style>
    html, body { margin: 0; min-height: 100%; background: #eef3ed; font-family: sans-serif; }
    body { display: flex; flex-direction: column; align-items: center; }
    canvas { display: block; max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js"></script>
  <script>
    const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

    const width = 800;
    const height = 450;
    const engine = Engine.create();

    const render = Render.create({
      element: document.body,
      engine,
      options: { width, height, wireframes: false, background: "#eef3ed" },
    });

    const moveSpeed = 4;     // 좌우 속도
    const jumpSpeed = -10;   // 점프 속도 (음수 = 위쪽)

    const ground = Bodies.rectangle(width / 2, height - 20, width, 40, {
      isStatic: true,
      label: "ground",
      render: { fillStyle: "#586b4d" },
    });
    const leftWall = Bodies.rectangle(0, height / 2, 30, height, {
      isStatic: true,
      render: { visible: false },
    });
    const rightWall = Bodies.rectangle(width, height / 2, 30, height, {
      isStatic: true,
      render: { visible: false },
    });
    const box = Bodies.rectangle(620, height - 70, 90, 60, {   // 올라가 볼 상자
      isStatic: true,
      label: "box",
      render: { fillStyle: "#4f82a8" },
    });
    const ball = Bodies.circle(400, 360, 20, {
      label: "ball",
      render: { fillStyle: "#d66b45" },
    });

    World.add(engine.world, [ground, leftWall, rightWall, box, ball]);

    // 지금 눌려 있는 키를 기억해 두는 객체
    const keys = {};
    window.addEventListener("keydown", (e) => {
      keys[e.code] = true;    // 키를 누르면 "눌렀다"고 적어 둬요
      if (e.code === "Space" || e.code.startsWith("Arrow")) e.preventDefault();   // 화면이 스크롤되지 않게
    });
    window.addEventListener("keyup", (e) => {
      keys[e.code] = false;   // 키에서 손을 떼면 "뗐다"고 적어 둬요
    });

    // beforeUpdate: 계산이 갱신되기 직전마다(1초에 약 60번) 눌린 키를 확인해요
    Events.on(engine, "beforeUpdate", () => {
      // setVelocity: 공의 속도를 내가 정한 값으로 바꿔요
      if (keys["ArrowRight"]) {
        Body.setVelocity(ball, { x: moveSpeed, y: ball.velocity.y });
      }
      if (keys["ArrowLeft"]) {
        Body.setVelocity(ball, { x: -moveSpeed, y: ball.velocity.y });
      }
      // 땅 확인이 없어요: Space를 누르고 있으면 공중에서도 계속 점프해요
      if (keys["Space"]) {
        Body.setVelocity(ball, { x: ball.velocity.x, y: jumpSpeed });
      }
    });

    // 안내 글자
    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.fillStyle = "#333";
      ctx.font = "15px sans-serif";
      ctx.fillText("카드 안을 한 번 클릭한 뒤  ← → 이동 / 스페이스바 점프", 20, 30);
    });

    // 카드 안을 클릭하면 키보드 입력을 받을 수 있어요
    window.addEventListener("mousedown", () => window.focus());
    window.focus();

    Render.run(render);
    Runner.run(Runner.create(), engine);
  </script>
</body>
</html>
```

### 단계 5 — 땅에 닿아 있을 때만 점프하기

단계 4에서 이어서, **공중 점프 문제**를 충돌 이벤트로 해결해요. `collisionStart`에서 공과 땅이 닿으면 `onGround`를 `true`로, `collisionEnd`에서 `false`로 바꿔요. `collisionEnd`는 두 물체가 **떨어지는 순간**에 오는 알림이에요. 점프는 `onGround`가 `true`일 때만 해요. 바뀐 부분은 단계 4와 비교해 `// ★`로 표시돼요.

```reflection title="단계 5 실행 전 예측"
1. 점프하고 공중에 있을 때 스페이스바를 또 누르면 어떻게 될까요? 단계 4와 비교해 보세요.
2. 화면의 `onGround` 글자는 언제 true가 되고 언제 false가 될까요?
3. 공이 상자 위에 올라서 있을 때도 점프할 수 있을까요? 땅이 아닌 물체에서도 되게 하려면 무엇을 바꿔야 할까요?
```

```html playground title="단계 5 — collisionStart/collisionEnd로 onGround 판정하기" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>단계 5: 땅에 닿아 있을 때만 점프</title>
  <style>
    html, body { margin: 0; min-height: 100%; background: #eef3ed; font-family: sans-serif; }
    body { display: flex; flex-direction: column; align-items: center; }
    canvas { display: block; max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js"></script>
  <script>
    const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

    const width = 800;
    const height = 450;
    const engine = Engine.create();

    const render = Render.create({
      element: document.body,
      engine,
      options: { width, height, wireframes: false, background: "#eef3ed" },
    });

    const moveSpeed = 4;     // 좌우 속도
    const jumpSpeed = -10;   // 점프 속도 (음수 = 위쪽)

    const ground = Bodies.rectangle(width / 2, height - 20, width, 40, {
      isStatic: true,
      label: "ground",
      render: { fillStyle: "#586b4d" },
    });
    const leftWall = Bodies.rectangle(0, height / 2, 30, height, {
      isStatic: true,
      render: { visible: false },
    });
    const rightWall = Bodies.rectangle(width, height / 2, 30, height, {
      isStatic: true,
      render: { visible: false },
    });
    const box = Bodies.rectangle(620, height - 70, 90, 60, {   // 올라가 볼 상자
      isStatic: true,
      label: "box",
      render: { fillStyle: "#4f82a8" },
    });
    const ball = Bodies.circle(400, 360, 20, {
      label: "ball",
      render: { fillStyle: "#d66b45" },
    });

    World.add(engine.world, [ground, leftWall, rightWall, box, ball]);

    let onGround = false;   // ★ 지금 땅에 닿아 있나요?

    // ★ 공과 땅이 닿기 시작하면 true (이 블록 전체가 새로 생겼어요)
    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (labels.includes("ball") && labels.includes("ground")) {
          onGround = true;
        }
      });
    });

    // ★ 공과 땅이 떨어지면 false (이 블록 전체가 새로 생겼어요)
    Events.on(engine, "collisionEnd", (event) => {
      event.pairs.forEach((pair) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (labels.includes("ball") && labels.includes("ground")) {
          onGround = false;
        }
      });
    });

    // 지금 눌려 있는 키를 기억해 두는 객체
    const keys = {};
    window.addEventListener("keydown", (e) => {
      keys[e.code] = true;    // 키를 누르면 "눌렀다"고 적어 둬요
      if (e.code === "Space" || e.code.startsWith("Arrow")) e.preventDefault();   // 화면이 스크롤되지 않게
    });
    window.addEventListener("keyup", (e) => {
      keys[e.code] = false;   // 키에서 손을 떼면 "뗐다"고 적어 둬요
    });

    // beforeUpdate: 계산이 갱신되기 직전마다(1초에 약 60번) 눌린 키를 확인해요
    Events.on(engine, "beforeUpdate", () => {
      // setVelocity: 공의 속도를 내가 정한 값으로 바꿔요
      if (keys["ArrowRight"]) {
        Body.setVelocity(ball, { x: moveSpeed, y: ball.velocity.y });
      }
      if (keys["ArrowLeft"]) {
        Body.setVelocity(ball, { x: -moveSpeed, y: ball.velocity.y });
      }
      // 땅에 닿아 있을 때(onGround)만 점프해요   // ★
      if (keys["Space"] && onGround) {   // ★
        Body.setVelocity(ball, { x: ball.velocity.x, y: jumpSpeed });
      }
    });

    // 안내 글자
    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.fillStyle = "#333";
      ctx.font = "15px sans-serif";
      ctx.fillText("카드 안을 한 번 클릭한 뒤  ← → 이동 / 스페이스바 점프", 20, 30);
      ctx.fillText("onGround: " + onGround, 20, 54);   // ★ 지금 값을 눈으로 확인
    });

    // 카드 안을 클릭하면 키보드 입력을 받을 수 있어요
    window.addEventListener("mousedown", () => window.focus());
    window.focus();

    Render.run(render);
    Runner.run(Runner.create(), engine);
  </script>
</body>
</html>
```

### 단계 6 — 미니 데모: 동전, 보너스, 가시, 게임오버

지금까지 배운 것을 모두 합쳐요. 단계 5의 키보드 공이 움직이고 점프해요. 장면 위에는 이런 물체들이 있어요.

- `"coin"`: 닿으면 사라지고 점수 1점
- `"gold"`: 닿으면 사라지고 점수 3점 (더 어려운 곳에 있어요)
- `"spike"`: 닿으면 `gameState`가 `"gameover"`가 돼요. 게임오버가 되면 공이 더 이상 움직이지 않고 화면에 "GAME OVER"가 떠요.

단계 5의 상자는 치웠어요. 동전류는 `isSensor: true`라서 닿았다는 알림은 오지만 공이 튕기지 않고 통과해요. 동전은 먹는 물건이라 튕기면 안 되기 때문이에요.

화면에는 점수와 상태가 보여요. 게임오버 후에는 **다시 시작** 버튼으로 처음 상태로 돌아가요. 다시 시작할 때 공을 처음 자리로 돌려놓는 데 단계 3에서 본 `Body.setPosition`과 `Body.setAngularVelocity`를 써요.

```reflection title="단계 6 실행 전 예측"
1. gold 동전과 coin 동전의 점수 차이를 코드의 어느 부분에서 정하고 있을까요?
2. 게임오버가 된 뒤에는 방향키를 눌러도 공이 움직이지 않아요. 코드의 어디에서 막고 있을 것 같나요?
3. 점수를 올리는 규칙과 게임오버 규칙은 둘 다 collisionStart 안에 있어요. 어떤 이름표(label)로 두 경우를 나누고 있을까요?
```

```html playground title="단계 6 — 동전, 보너스, 가시, 게임오버" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>단계 6: 동전, 보너스, 가시, 게임오버</title>
  <style>
    html, body { margin: 0; min-height: 100%; background: #eef3ed; font-family: sans-serif; }
    body { display: flex; flex-direction: column; align-items: center; }
    canvas { display: block; max-width: 100%; height: auto; }
    .bar { height: 50px; display: flex; align-items: center; gap: 8px; }   /* ★ */
    button { font-size: 16px; padding: 6px 14px; }   /* ★ */
  </style>
</head>
<body>
  <div class="bar"><button id="restart">다시 시작</button></div>   <!-- ★ -->
  <script src="https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js"></script>
  <script>
    const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

    const width = 800;
    const height = 400;   // ★ 버튼 자리를 위해 조금 낮춰요
    const engine = Engine.create();

    const render = Render.create({
      element: document.body,
      engine,
      options: { width, height, wireframes: false, background: "#eef3ed" },
    });

    const moveSpeed = 4;     // 좌우 속도
    const jumpSpeed = -10;   // 점프 속도 (음수 = 위쪽)

    const ground = Bodies.rectangle(width / 2, height - 20, width, 40, {
      isStatic: true,
      label: "ground",
      render: { fillStyle: "#586b4d" },
    });
    const leftWall = Bodies.rectangle(0, height / 2, 30, height, {
      isStatic: true,
      render: { visible: false },
    });
    const rightWall = Bodies.rectangle(width, height / 2, 30, height, {
      isStatic: true,
      render: { visible: false },
    });
    const ball = Bodies.circle(60, 320, 20, {   // ★ 시작 위치
      label: "ball",
      render: { fillStyle: "#d66b45" },
    });
    // ★ 가시: 삼각형을 위로 뾰족하게 세워요, 닿으면 게임오버 (이 블록 전체가 새로 생겼어요)
    const spike = Bodies.polygon(520, height - 51, 3, 22, {
      isStatic: true,
      angle: Math.PI / 2,
      label: "spike",
      render: { fillStyle: "#7a2f2f" },
    });

    World.add(engine.world, [ground, leftWall, rightWall, ball, spike]);   // ★

    let score = 0;                // ★ 점수
    let gameState = "playing";    // ★ "playing" 또는 "gameover"
    let onGround = false;
    let pickups = [];             // ★ 아직 안 먹은 동전들

    // ★ 동전류 만들기: 통과하며 먹는 물체라서 isStatic + isSensor (이 블록 전체가 새로 생겼어요)
    function makePickups() {
      const make = (label, x, y, r, color) =>
        Bodies.circle(x, y, r, {
          isStatic: true,   // 공중에 고정
          isSensor: true,   // 닿았다는 알림은 오지만 부딪혀 튕기지는 않아요
          label,
          render: { fillStyle: color },
        });
      return [
        make("coin", 250, 325, 10, "#e7b84b"),   // 걸어가며 먹어요
        make("coin", 380, 285, 10, "#e7b84b"),   // 살짝 점프
        make("coin", 520, 255, 10, "#e7b84b"),   // 가시 위
        make("gold", 650, 190, 12, "#f2a900"),   // 가장 높은 곳
      ];
    }

    // ★ 처음 상태로 되돌리는 일은 이 함수 한 곳에 모아요 (이 블록 전체가 새로 생겼어요)
    function resetGame() {
      pickups.forEach((p) => World.remove(engine.world, p));   // 남은 동전 치우기
      pickups = makePickups();                                  // 동전 새로 만들기
      World.add(engine.world, pickups);
      Body.setPosition(ball, { x: 60, y: 320 });                // 공 제자리로
      Body.setVelocity(ball, { x: 0, y: 0 });
      Body.setAngularVelocity(ball, 0);
      score = 0;
      gameState = "playing";
      onGround = false;
    }
    resetGame();   // ★ 시작할 때도 같은 함수를 써요

    // ★ 먹은 동전을 없애고 점수를 올려요 (이 블록 전체가 새로 생겼어요)
    function collect(body, points) {
      if (!pickups.includes(body)) return;                 // 이미 먹은 것이면 무시
      pickups = pickups.filter((p) => p !== body);
      World.remove(engine.world, body);
      score += points;
    }

    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (labels.includes("ball") && labels.includes("ground")) {
          onGround = true;
        }
        // ★ 점수와 게임오버 규칙 (이 블록 전체가 새로 생겼어요)
        if (gameState !== "playing") return;   // 게임이 끝났으면 점수 규칙은 건너뛰어요
        if (labels.includes("ball") && labels.includes("coin")) {
          collect(pair.bodyA.label === "coin" ? pair.bodyA : pair.bodyB, 1);   // 1점
        }
        if (labels.includes("ball") && labels.includes("gold")) {
          collect(pair.bodyA.label === "gold" ? pair.bodyA : pair.bodyB, 3);   // 3점
        }
        if (labels.includes("ball") && labels.includes("spike")) {
          gameState = "gameover";
        }
      });
    });

    Events.on(engine, "collisionEnd", (event) => {
      event.pairs.forEach((pair) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (labels.includes("ball") && labels.includes("ground")) {
          onGround = false;
        }
      });
    });

    // 지금 눌려 있는 키를 기억해 두는 객체
    const keys = {};
    window.addEventListener("keydown", (e) => {
      keys[e.code] = true;    // 키를 누르면 "눌렀다"고 적어 둬요
      if (e.code === "Space" || e.code.startsWith("Arrow")) e.preventDefault();   // 화면이 스크롤되지 않게
    });
    window.addEventListener("keyup", (e) => {
      keys[e.code] = false;   // 키에서 손을 떼면 "뗐다"고 적어 둬요
    });

    // beforeUpdate: 계산이 갱신되기 직전마다(1초에 약 60번) 눌린 키를 확인해요
    Events.on(engine, "beforeUpdate", () => {
      // ★ 게임오버면 조작을 막아요 (이 블록 전체가 새로 생겼어요)
      if (gameState !== "playing") {   // 게임오버면 조작을 막아요
        Body.setVelocity(ball, { x: 0, y: ball.velocity.y });   // 옆으로 미끄러지지 않게 멈춰요
        return;
      }
      // setVelocity: 공의 속도를 내가 정한 값으로 바꿔요
      if (keys["ArrowRight"]) {
        Body.setVelocity(ball, { x: moveSpeed, y: ball.velocity.y });
      }
      if (keys["ArrowLeft"]) {
        Body.setVelocity(ball, { x: -moveSpeed, y: ball.velocity.y });
      }
      // 땅에 닿아 있을 때(onGround)만 점프해요
      if (keys["Space"] && onGround) {
        Body.setVelocity(ball, { x: ball.velocity.x, y: jumpSpeed });
      }
    });

    // 안내 글자
    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.fillStyle = "#333";
      ctx.font = "15px sans-serif";
      ctx.fillText("점수: " + score + "    gameState: " + gameState, 20, 30);   // ★
      ctx.font = "14px sans-serif";   // ★
      ctx.fillText("카드 안을 한 번 클릭한 뒤  ← → 이동 / 스페이스바 점프", 20, 52);   // ★
      if (gameState === "gameover") {   // ★ 게임오버 화면 (이 블록 전체가 새로 생겼어요)
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 56px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", width / 2, height / 2);
        ctx.textAlign = "left";
      }
    });

    // ★ 다시 시작 버튼 (이 블록 전체가 새로 생겼어요)
    const restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", () => {
      resetGame();
      restartButton.blur();   // 스페이스바가 버튼을 또 누르지 않게
    });

    // 카드 안을 클릭하면 키보드 입력을 받을 수 있어요
    window.addEventListener("mousedown", () => window.focus());
    window.focus();

    Render.run(render);
    Runner.run(Runner.create(), engine);
  </script>
</body>
</html>
```

### 실행하고 관찰하기

1. 각 카드의 **▶ 실행**을 누르기 전에 위 예측 칸에 먼저 내 생각을 적으세요.
2. 실행하고 예측과 비교해요. 틀렸다면 **왜 달랐는지** 한 줄로 적어 보세요.
3. 한 번에 **하나만** 바꾸세요. (4주차와 같은 약속이에요.)
   - 단계 2: 목표물의 `label`을 다른 이름으로 바꾸고, 코드의 `"target"`은 그대로 두면 어떻게 되는지 보세요.
   - 단계 3: 점수를 1점이 아니라 다른 값으로 바꾸거나, 공의 시작 속도를 바꿔 공이 어디까지 굴러가는지 보세요. `x: 10`은 처음 굴리는 줄과 "다시 굴리기" 버튼 안, 두 곳에 있으니 같이 바꿔요.
   - 단계 4: `moveSpeed`나 `jumpSpeed` 숫자를 바꿔 보세요. 점프가 얼마나 높아지나요?
   - 단계 5: `collisionEnd` 블록을 주석 처리하면 어떻게 될지 먼저 예측해 보세요. 그다음 실행해서 확인해요.
   - 단계 6: 가시 위치를 바꾸거나 gold 점수를 바꿔 게임이 쉬워지는지 어려워지는지 보세요.
4. 키보드 조작(단계 4~6)은 **카드 안을 한 번 클릭해서** 초점을 맞춘 뒤 눌러야 해요.
5. (선택) 내 컴퓨터에서 해 보려면 VS Code에서 `index.html`로 저장하고 Live Server의 **Go Live**를 누르세요. CDN을 쓰므로 인터넷 연결이 필요해요. 인터넷이 없으면 3주차처럼 `matter.min.js`를 내려받아 같은 폴더에 두고 `<script src="matter.min.js"></script>`로 연결해요.

## 미션 A: 사라지고 점수가 다른 나만의 물체

단계 6의 미니 데모에 **나만의 새 물체**를 더해 보세요. 코드를 쓰기 전에 예측부터 적어요.

```reflection title="미션 A 예측 기록 (코드를 쓰기 전에!)"
1. 어떤 새 물체를 만들 건가요? (예: 5점짜리 별, 닿으면 사라지는 풍선, 점수를 깎는 폭탄 등)
2. 그 물체의 label은 무엇으로 지을 건가요? 왜 그 이름인가요?
3. 공이 닿았을 때 점수와 물체에 각각 어떤 일이 생길 것 같나요?
```

- **해야 할 일:** 아래 시작 코드는 단계 6의 데모예요. `// ✏️` 표시를 보고 **새로운 종류의 물체를 하나 이상** 더하세요. 원한다면 점수 값이나 물체 위치를 바꿔도 좋아요.
  - 예: **5점짜리 `"star"`**를 높은 곳에 두고 닿으면 사라지게 하기
  - 예: 닿으면 **점수가 깎이는 `"bomb"`**(게임오버는 아니에요) 만들기
  - 예: 닿아도 **사라지지 않고** 점수만 오르는 `"bumper"` 만들기
- **완료 조건:**
  1. 시작 코드에 없던 `label`을 가진 물체가 **하나 이상** 있어요.
  2. 그 물체에 공이 닿으면 **점수가 바뀌어요.** (사라지는지 여부는 내가 정해요.)
  3. 기존 동전, 보너스, 가시가 여전히 잘 동작해요.
  4. 새 물체의 `label`과 점수 규칙이 코드의 어디에 있는지 손으로 짚어서 설명할 수 있어요.
  5. 적어 둔 예측과 실제 결과를 비교하고, 달랐던 점을 한 줄로 적었어요.

```html playground title="미션 A 시작 코드 — 사라지고 점수가 다른 물체" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>미션 A: 나만의 물체 더하기</title>
  <style>
    html, body { margin: 0; min-height: 100%; background: #eef3ed; font-family: sans-serif; }
    body { display: flex; flex-direction: column; align-items: center; }
    canvas { display: block; max-width: 100%; height: auto; }
    .bar { height: 50px; display: flex; align-items: center; gap: 8px; }
    button { font-size: 16px; padding: 6px 14px; }
  </style>
</head>
<body>
  <div class="bar"><button id="restart">다시 시작</button></div>
  <script src="https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js"></script>
  <script>
    const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

    const width = 800;
    const height = 400;   // 버튼 자리를 위해 조금 낮춰요
    const engine = Engine.create();

    const render = Render.create({
      element: document.body,
      engine,
      options: { width, height, wireframes: false, background: "#eef3ed" },
    });

    const moveSpeed = 4;     // 좌우 속도
    const jumpSpeed = -10;   // 점프 속도 (음수 = 위쪽)

    const ground = Bodies.rectangle(width / 2, height - 20, width, 40, {
      isStatic: true,
      label: "ground",
      render: { fillStyle: "#586b4d" },
    });
    const leftWall = Bodies.rectangle(0, height / 2, 30, height, {
      isStatic: true,
      render: { visible: false },
    });
    const rightWall = Bodies.rectangle(width, height / 2, 30, height, {
      isStatic: true,
      render: { visible: false },
    });
    const ball = Bodies.circle(60, 320, 20, {   // 시작 위치
      label: "ball",
      render: { fillStyle: "#d66b45" },
    });
    // 가시: 삼각형을 위로 뾰족하게 세워요 (닿으면 게임오버)
    const spike = Bodies.polygon(520, height - 51, 3, 22, {
      isStatic: true,
      angle: Math.PI / 2,
      label: "spike",
      render: { fillStyle: "#7a2f2f" },
    });

    World.add(engine.world, [ground, leftWall, rightWall, ball, spike]);
    // ✏️ 1) 사라지지 않는 물체(bumper 등)는 여기서 만들고 World.add 해요. 딱 한 번만 넣어야 해서 resetGame 안에는 넣지 않아요
    //       (사라지는 물체는 아래 2번처럼 makePickups 배열에 넣으면 월드에 자동으로 들어가요)

    let score = 0;                // 점수
    let gameState = "playing";    // "playing" 또는 "gameover"
    let onGround = false;
    let pickups = [];             // 아직 안 먹은 동전들

    // 동전류 만들기: 통과하며 먹는 물체라서 isStatic + isSensor
    function makePickups() {
      const make = (label, x, y, r, color) =>
        Bodies.circle(x, y, r, {
          isStatic: true,   // 공중에 고정
          isSensor: true,   // 닿았다는 알림은 오지만 부딪혀 튕기지는 않아요
          label,
          render: { fillStyle: color },
        });
      return [
        make("coin", 250, 325, 10, "#e7b84b"),   // 걸어가며 먹어요
        make("coin", 380, 285, 10, "#e7b84b"),   // 살짝 점프
        make("coin", 520, 255, 10, "#e7b84b"),   // 가시 위
        make("gold", 650, 190, 12, "#f2a900"),   // 가장 높은 곳
        // ✏️ 2) 사라지는 물체를 만드는 자리: make("내이름표", x, y, 반지름, "색")
      ];
    }

    // 처음 상태로 되돌리는 일은 이 함수 한 곳에 모아요
    function resetGame() {
      pickups.forEach((p) => World.remove(engine.world, p));   // 남은 동전 치우기
      pickups = makePickups();                                  // 동전 새로 만들기
      World.add(engine.world, pickups);
      Body.setPosition(ball, { x: 60, y: 320 });                // 공 제자리로
      Body.setVelocity(ball, { x: 0, y: 0 });
      Body.setAngularVelocity(ball, 0);
      score = 0;
      gameState = "playing";
      onGround = false;
      // ✏️ 3) 내가 새로 만든 변수가 있으면 여기서 처음 값으로 되돌려요
    }
    resetGame();   // 시작할 때도 같은 함수를 써요

    // 먹은 동전을 없애고 점수를 올려요
    function collect(body, points) {
      if (!pickups.includes(body)) return;                 // 이미 먹은 것이면 무시
      pickups = pickups.filter((p) => p !== body);
      World.remove(engine.world, body);
      score += points;
    }

    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (labels.includes("ball") && labels.includes("ground")) {
          onGround = true;
        }
        if (gameState !== "playing") return;   // 게임이 끝났으면 점수 규칙은 건너뛰어요
        if (labels.includes("ball") && labels.includes("coin")) {
          collect(pair.bodyA.label === "coin" ? pair.bodyA : pair.bodyB, 1);   // 1점
        }
        if (labels.includes("ball") && labels.includes("gold")) {
          collect(pair.bodyA.label === "gold" ? pair.bodyA : pair.bodyB, 3);   // 3점
        }
        if (labels.includes("ball") && labels.includes("spike")) {
          gameState = "gameover";
        }
        // ✏️ 4) 새 물체에 닿았을 때의 규칙을 여기에 더해요 (labels.includes("내이름표")를 써요)
      });
    });

    Events.on(engine, "collisionEnd", (event) => {
      event.pairs.forEach((pair) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (labels.includes("ball") && labels.includes("ground")) {
          onGround = false;
        }
      });
    });

    // 지금 눌려 있는 키를 기억해 두는 객체
    const keys = {};
    window.addEventListener("keydown", (e) => {
      keys[e.code] = true;    // 키를 누르면 "눌렀다"고 적어 둬요
      if (e.code === "Space" || e.code.startsWith("Arrow")) e.preventDefault();   // 화면이 스크롤되지 않게
    });
    window.addEventListener("keyup", (e) => {
      keys[e.code] = false;   // 키에서 손을 떼면 "뗐다"고 적어 둬요
    });

    // beforeUpdate: 계산이 갱신되기 직전마다(1초에 약 60번) 눌린 키를 확인해요
    Events.on(engine, "beforeUpdate", () => {
      if (gameState !== "playing") {   // 게임오버면 조작을 막아요
        Body.setVelocity(ball, { x: 0, y: ball.velocity.y });   // 옆으로 미끄러지지 않게 멈춰요
        return;
      }
      // setVelocity: 공의 속도를 내가 정한 값으로 바꿔요
      if (keys["ArrowRight"]) {
        Body.setVelocity(ball, { x: moveSpeed, y: ball.velocity.y });
      }
      if (keys["ArrowLeft"]) {
        Body.setVelocity(ball, { x: -moveSpeed, y: ball.velocity.y });
      }
      // 땅에 닿아 있을 때(onGround)만 점프해요
      if (keys["Space"] && onGround) {
        Body.setVelocity(ball, { x: ball.velocity.x, y: jumpSpeed });
      }
    });

    // 안내 글자
    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.fillStyle = "#333";
      ctx.font = "15px sans-serif";
      ctx.fillText("점수: " + score + "    gameState: " + gameState, 20, 30);
      ctx.font = "14px sans-serif";
      ctx.fillText("카드 안을 한 번 클릭한 뒤  ← → 이동 / 스페이스바 점프", 20, 52);
      if (gameState === "gameover") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 56px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", width / 2, height / 2);
        ctx.textAlign = "left";
      }
    });

    // 다시 시작 버튼
    const restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", () => {
      resetGame();
      restartButton.blur();   // 스페이스바가 버튼을 또 누르지 않게
    });

    // 카드 안을 클릭하면 키보드 입력을 받을 수 있어요
    window.addEventListener("mousedown", () => window.focus());
    window.focus();

    Render.run(render);
    Runner.run(Runner.create(), engine);
  </script>
</body>
</html>
```

<details>
<summary>힌트 1: 어디에 코드를 더할까요?</summary>

사라지는 물체는 ✏️ 2) 자리에 `make(…)`를 한 줄 더하고, ✏️ 4) 자리에 `labels.includes("내이름표")` 규칙을 써요. 사라지지 않는 물체는 ✏️ 1) 자리에서 만들고 `World.add` 한 뒤, ✏️ 4) 자리에서 `score`를 직접 바꿔요. 이미 있는 `"coin"` 규칙을 복사해서 이름과 숫자만 바꾸면 시작할 수 있어요.

</details>

<details>
<summary>힌트 2: 물체가 화면에 보이지 않아요</summary>

사라지는 물체라면 ✏️ 2) 배열 안에, 사라지지 않는 물체라면 ✏️ 1) 자리에서 `World.add`까지 했는지 확인하세요. 참고로 `makePickups` 밖에서 따로 만든 물체는 `collect`가 모르니, 점수는 `score += 점수`로 직접 올려야 해요. 물체를 만들기만 하고 월드에 넣지 않으면 화면에 나타나지 않아요. 위치(`x`, `y`)가 화면 밖은 아닌지도 확인해 보세요.

</details>

<details>
<summary>힌트 3: 점수가 이상하게 올라가요</summary>

한 번 맞혔는데 점수가 두 번 올라간다면, 없앤 물체에 대해 점수 올리는 코드를 한 번 더 지나가고 있을 수 있어요. "이미 없앴는지" 확인하는 줄을 단계 3에서 찾아보세요. 사라지지 않는 물체(`bumper`)라면 닿을 때마다 점수가 오르는 게 정상일 수 있어요. 규칙이 원하는 대로 설계됐는지 생각해 보세요.

</details>

## 미션 B: 게임오버 조건 설계하기

단계 6의 게임오버는 "가시에 닿으면"이었어요. 이번에는 **나만의 게임오버(또는 승리) 조건**을 설계해 보세요. 미션 A에서 쓴 코드를 이어서 써도 돼요.

- **해야 할 일:** 지금과 **다른 게임오버 조건**을 하나 이상 만들고, `gameState`가 `"gameover"`로 바뀌게 하세요. 어떤 조건이 재미있을지 먼저 종이나 메모에 한 줄로 적어요.
  - 예: **점수가 0 미만**이 되면 게임오버 (미션 A의 폭탄과 어울려요)
  - 예: 공이 **땅에 떨어진 횟수가 3번**이 되면 게임오버
  - 예: **모든 coin을 먹으면** `"win"` 상태로 바꾸고 화면에 "클리어!" 띄우기
- **완료 조건:**
  1. 새 조건이 실제로 동작해서 화면에 결과(GAME OVER 등)가 떠요.
  2. 조건을 확인하는 곳이 `collisionStart` 안인지, 아니면 다른 곳인지 설명할 수 있어요. (이유와 함께)
  3. 게임이 끝난 뒤에도 점수가 마음대로 올라가지 않도록 `gameState`를 확인해요.
  4. **다시 시작** 버튼을 눌렀을 때 내 조건도 처음 상태로 돌아가요.

<details>
<summary>힌트 1: 조건을 확인할 자리 정하기</summary>

"무엇이 닿았을 때"가 조건이면 `collisionStart` 안이 좋아요. "점수가 얼마가 됐을 때"처럼 닿는 일과 상관없는 조건이라면, 점수가 바뀐 바로 다음 줄에서 '점수가 0보다 작아졌나?'를 `if` 문으로 묻고, 맞으면 `gameState`를 바꿔 보세요.

</details>

<details>
<summary>힌트 2: 횟수를 세고 싶어요</summary>

새 변수가 필요해요. 예를 들어 `let misses = 0;`을 만들고, 조건에 맞는 일이 생길 때마다 `misses += 1`을 해요. 그리고 `if (misses >= 3)`일 때 게임오버로 바꿔요. 다시 시작할 때는 `misses = 0`으로 되돌리는 것을 잊지 마세요.

</details>

<details>
<summary>힌트 3: 다시 시작해도 내 조건이 남아 있어요</summary>

새로 만든 변수는 다시 시작 코드에서 **내가 직접** 처음 값으로 돌려놓아야 해요. 시작 코드의 `resetGame` 함수(✏️ 3) 자리)에 내 변수도 같이 처음 값으로 되돌리는 줄을 넣었는지 확인해 보세요.

</details>

## 도전 미션: 시간 제한이 있는 점수 게임

점수 게임에는 보통 **끝나는 때**가 있어요. 시간 제한이나 목숨 같은 규칙을 더해서 한 판이 끝나도록 만들어 보세요.

- **해야 할 일:** 남은 시간(또는 목숨)을 변수로 만들고, 0이 되면 `gameState`를 바꿔서 한 판을 끝내세요. 끝날 때 최종 점수를 화면에 보여 주세요.
- **완료 조건:**
  1. 남은 시간(또는 목숨)이 화면에 보이고 실제로 줄어들어요.
  2. 0이 되면 게임이 끝나고 최종 점수가 보여요.
  3. **다시 시작**을 누르면 시간(또는 목숨)과 점수가 처음으로 돌아가요.
  4. 시간을 `setInterval`이나 `beforeUpdate` 중 어느 쪽으로 줄였는지, 이유와 함께 설명할 수 있어요.

## 오늘 배운 것 정리하기

- 이벤트(`Events.on`)는 무엇이고, `beforeUpdate`와 `collisionStart`는 각각 언제 실행되나요?
- `collisionStart`는 닿아 있는 동안 계속 실행될까요, 닿는 순간에만 실행될까요?
- `bodyA`와 `bodyB`가 누구인지 어떻게 알아내나요? `label`은 어떤 역할을 하나요?
- 목표물에 공이 닿았을 때 점수를 올리고 물체를 없애는 코드를 말로 설명해 보세요.
- 키보드로 공을 움직일 때 `keys` 객체에는 무엇을 기억해 두고, 그것을 어디에서 확인하나요?
- 단계 4(땅 확인 없음)와 단계 5(`onGround`)는 무엇이 달랐나요?
- `score`와 `gameState`는 왜 변수로 만들어 두나요? 게임오버 뒤에 점수가 오르지 않게 하려면 무엇을 확인해야 하나요?
- 오늘 예측이 가장 크게 틀렸던 곳은 어디였고, 그 이유는 무엇이었나요?
- 다음 시간에는 **물체를 줄이나 스프링으로 연결**해서 그네와 투석기 같은 장치를 만들어 볼 거예요. 줄에 매달린 공이 목표물에 부딪히면 어떤 게임이 될지 생각해 보세요.

## 교사용 메모 (학생에게는 숨김)

- **대상 / 주차 / 수업 시간:** 중학교 1학년 1명 / 5주차 / 100분(전반 50 + 후반 50).
- **전제:** 학생은 4주차(isStatic, density·friction·restitution·frictionAir, 모양, angle)까지만 배웠다. 키보드 입력은 오늘 처음 배운다. `Events.on`은 4주차 코드에서 화면에 글자를 쓸 때(`afterRender`) 설명 없이 써 봤고, 오늘 정식으로 배운다. `applyForce`는 다루지 않는다. `Body.setVelocity`는 4주차 단계 2에서 공을 밀 때 써 본 것을 키보드 조작용으로 짧게 다시 쓴다. `Body.setPosition`과 `Body.setAngularVelocity`는 단계 3에서 처음 쓴다.
- **수업 흐름 예시 (100분):**
  - 전반 50분: 4주차 복습 + 시작·왜 7분, 개념 설명 10분(Events.on·beforeUpdate·afterRender 3분, 키보드·setVelocity 1분, collisionStart/End·label 3분, remove·isSensor·상태 변수 3분), 단계 1~5 실험 33분. 단계 3의 "다시 굴리기"와 단계 4(키보드)는 새로 나오는 부분이라 손으로 직접 해 보는 시간을 충분히 준다. 단계 2는 시연 위주로 짧게 해도 된다.
  - 후반 50분: 단계 6 실행·관찰 10분, 미션 A 25분(예측 5분 포함), 정리 10분, 여유 5분(미션 B 착수). **미션 B는 시간이 남을 때(0~15분)** 하고, 모자라면 다음 주 도입에서 이어 간다. **도전 미션은 선택 과제**(시간이 남거나 다음 주 도입)로 돌린다.
- **범위 안내:** Constraint(줄·스프링)와 Composite는 6주차 내용이다. 마우스 조작(Mouse, MouseConstraint)은 다루지 않는다. `collisionActive`와 `pair.collision` 같은 세부 속성, `applyForce`는 다루지 않는다.
- **교과·생활 연계 시 주의:** 이번 주는 충돌의 물리량(충격량, 운동량)이 아니라 "닿았다는 사실"만 사용한다. 점수·속도 숫자는 시뮬레이션 값이며 실제 단위와 대응하지 않는다.
- **수업 전 확인 필요(실행 확인 필요):** 숫자와 위치는 Matter.js 0.19.0 기준으로 설계했지만 브라우저에서 직접 실행해 확인하지 않았다. 수업 전에 한 번 돌려 보고 본문과 맞는지 확인한다.
  - 단계 1: 부딪힘 횟수가 본문 예측 질문과 맞는지. 예측 Q3("한 번에 2씩 오를 수 있을까요?")의 예상 답은 "공이 상자 모서리와 바닥에 동시에 닿으면 짝이 2개라 +2가 될 수 있지만, 이 장면에서는 드물다"이다. 실제로 그런지 확인한다.
  - 단계 3: 공(friction 0.01, frictionAir 0, 시작 속도 x=10)이 한 번 굴릴 때마다 가장 가까운 목표물 하나를 맞히고 튕겨 돌아오는지(계산상 3번 굴리면 3점, 4번째는 그대로 3점), 공이 목표물에 닿기 전에 멈추지 않는지, 이미 없앤 목표물로 점수가 또 오르지 않는지.
  - 단계 4: 땅 확인 없이 Space를 누르고 있으면 공중에서 계속 올라가는 현상이 눈에 띄는지, 상자(90×60) 위에 올라설 수 있는지.
  - 단계 5: `jumpSpeed`(-10 전후)와 `collisionStart`/`collisionEnd` 기반 `onGround`가 안정적인지. 공이 굴러가는 동안 `collisionEnd`가 잠깐 들어와 점프가 안 먹히는 경우가 없는지.
  - 단계 6: coin 1점, gold 3점, spike 위치, 게임오버 후 입력 차단, 다시 시작 버튼이 모든 물체와 `score`·`gameState`를 되돌리는지.
  - 키보드 입력이 iframe 안에서 먹으려면 카드 클릭으로 포커스가 필요하다. 본문 안내가 맞는지 본다.
- **함께 만들기 단계 관련:**
  - 단계 2는 단계 1에서, 단계 3은 단계 2에서, 단계 5는 단계 4에서, 단계 6은 단계 5에서 이어지는 구조라 `// ★` 변경 표시를 넣는다.
  - 단계 4는 앞 단계(1~3)와 이어지지 않는 새 장면이라 `// ★`를 넣지 않는다. 단계 5의 `// ★`는 단계 4 대비 바뀐 부분(`onGround`, `collisionStart`/`collisionEnd`, 점프 조건)이다.
  - 미션 A의 시작 코드는 단계 6의 데모와 같은 조작과 구조를 쓰고, `// ✏️`로 학생이 고칠 자리를 표시한다.
- **예상되는 오개념 / 막히는 지점:**
  - `Events.on`을 "계속 실행되는 반복문"으로 오해한다. 이벤트는 "그 일이 일어났을 때"만 실행된다고 초인종 비유로 짚는다. (`beforeUpdate`·`afterRender`는 매번, `collisionStart`·`collisionEnd`는 그 일이 생길 때만 실행된다는 점을 구분해서 설명)
  - 키를 누를 때(`keydown`) 바로 공을 움직이려 한다. `keys`에 기억해 두고 `beforeUpdate`에서 확인하는 이유를 단계 4로 보여 준다.
  - `collisionStart`를 "닿아 있는 동안 계속"으로 오해한다. 초인종 비유와 단계 1의 숫자(가만히 멈춘 공에서는 안 올라감)로 짚는다.
  - `bodyA`가 항상 공이라고 가정하고 `pair.bodyA.label === "ball"`만 확인한다. 단계 2 예측 2번으로 두 방향을 다 확인해야 하는 이유를 겪게 한다.
  - `label`의 철자가 코드 두 군데에서 다르다 (`"target"`과 `"targets"` 등). 글자 하나만 달라도 다른 이름표라고 안내한다.
  - 같은 목표물을 같은 알림에서 두 번 처리해 점수가 두 번 오른다. 단계 3 예측 3번과 `collect` 도우미의 "이미 먹은 것이면 무시" 줄로 유도한다.
  - `gameState` 확인을 빼먹어 게임오버 뒤에도 점수가 오른다. 미션 B 완료 조건 3번으로 점검한다.
  - 다시 시작에서 새로 만든 변수나 물체를 되돌리지 않는다. 미션 B 힌트 3번으로 유도한다.
  - 문자열 비교에 `=`를 쓴다 (`gameState = "playing"`). `===`와 구분하여 설명한다.
- **도움이 필요할 때 줄 질문이나 힌트:**
  - "이 규칙은 '누가 누구에게 닿았을 때'야, 아니면 '점수가 어떻게 됐을 때'야?"
  - "지금 부딪힌 두 물체의 label을 `console.log`로 찍어 보면 어떨까?" (브라우저 개발자 도구 콘솔 사용을 알려 줄 기회)
  - "`bodyA`가 공일 수도, 목표물일 수도 있는데 코드가 둘 다 확인해?"
  - "방금 바꾼 값이 하나야, 여러 개야?"
- **미션 A 채점 기준:** 정답이 하나가 아니다. (1) 새 `label`의 물체가 월드에 있고 닿으면 점수가 바뀐다. (2) 기존 coin·gold·spike 동작과 점프가 유지된다. (3) 새 규칙이 코드의 어디에 있는지 설명한다. (4) 예측과 결과를 비교한 한 줄이 있다. 값의 정확성보다 "이름표로 규칙을 나눈다"는 이해를 평가한다. 아래 예시 답안은 시작 코드의 구조(`makePickups`가 만든 `pickups` 배열을 `resetGame()`이 `World.add`하고, `collect(body, points)`가 중복 확인·제거·점수를 한 번에 처리)에 **덧붙이는** 형태이며, 기존 `coin`·`gold`·`spike` 규칙과 점프 동작은 지우지 않는다. (`star` 위치와 점수는 실행 확인 필요)

  ```js
  // (✏️ 2 자리) makePickups()의 반환 배열 끝에 star를 덧붙임 (isStatic, isSensor는 make 도우미가 이미 true로 넣어 줘요)
  return [
    make("coin", 250, 325, 10, "#e7b84b"),
    make("coin", 380, 285, 10, "#e7b84b"),
    make("coin", 520, 255, 10, "#e7b84b"),
    make("gold", 650, 190, 12, "#f2a900"),
    make("star", 730, 200, 14, "#ffd54a"),   // 새로 덧붙임: 5점짜리 별 (최대 점프 때 공 중심이 y≈195 전후까지 올라가 y=200이면 닿아요. 실행 확인 필요)
  ];
  // resetGame()은 pickups 전체를 World.add 하므로 star도 자동으로 월드에 들어가고, 다시 시작하면 되살아난다.

  // (✏️ 4 자리) collisionStart의 기존 coin / gold / spike 규칙 아래에 덧붙임
  if (labels.includes("ball") && labels.includes("star")) {
    collect(pair.bodyA.label === "star" ? pair.bodyA : pair.bodyB, 5);   // 5점
  }
  ```

  `make` 도우미를 쓰지 않고 `Bodies.circle`로 직접 만든다면 `isStatic: true, isSensor: true, label: "star"`를 직접 적고, 반드시 `pickups` 배열에 넣어야 `collect`가 동작한다(`pickups.includes(body)` 확인 때문). 그렇지 않으면 사라지지 않거나 점수가 오르지 않는다. `makePickups` 밖에서 따로 만든 물체는 `collect`가 모르므로 `score += 점수`로 직접 올리게 안내한다.
- **미션 B 예시 답안:** 시작 코드에 덧붙이는 형태다. 기존 가시 규칙은 그대로 두고 "점수 0 미만이면 게임오버"를 추가한다.

  ```js
  // 기존 점수 올리고 내리는 규칙들 바로 아래에 덧붙임
  if (score < 0 && gameState === "playing") {
    gameState = "gameover";
  }
  ```

  "땅에 3번 떨어지면"은 `let misses = 0;`을 새로 만들고 `collisionStart`에서 `labels.includes("ball") && labels.includes("ground")`일 때 `misses += 1`, `misses >= 3`이면 `gameState = "gameover"`로 바꾼다. (점프 착지도 땅에 닿는 것이므로 "떨어진 횟수"의 정의를 학생과 정한다.) 다시 시작에서 `misses = 0`을 함께 되돌린다. 승리 조건은 `gameState = "win"`으로 바꾸고, 기존의 `gameState !== "playing"` 입력 차단이 `"win"`에도 적용되는지 확인한다. 어떤 방식이든 완료 조건 4개를 만족하면 인정한다.
- **도전 미션 예시:** `let timeLeft = 30;`을 만들고 `setInterval`로 1초마다 1씩 줄이거나(`gameState === "playing"`일 때만), `beforeUpdate`에서 프레임 수로 센다. `timeLeft <= 0`이면 `gameState = "gameover"`로 바꾼다. `afterRender`에서 남은 시간과 최종 점수를 쓴다. `setInterval`을 쓰면 다시 시작할 때 타이머가 여러 개 겹치지 않는지 확인한다. 시간 값(30초)은 실행 확인 필요.
- **다음 수업을 위해 기록할 관찰:** 학생이 이벤트("그 일이 일어났을 때 실행")를 이해했는지, `bodyA`/`bodyB` 문제를 스스로 이해했는지, `label`을 규칙 구분에 스스로 활용하는지, 점수 중복 증가와 `gameState` 확인 누락을 스스로 발견했는지 메모한다. 6주차에서는 Constraint로 줄에 매달린 공을 만들고, 오늘의 `collisionStart`와 `label`로 목표물을 맞히는 투석기·그네 데모로 이어 간다.