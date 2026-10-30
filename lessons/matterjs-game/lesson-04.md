# 4주차: 물체마다 성질을 정해 주면 움직임이 달라져요

## 오늘 해볼 일

지난주에는 Matter.js로 상자와 공이 쌓이는 월드를 만들었어요. 그런데 그 물체들은 모두 비슷한 성질로 움직였어요. 오늘은 물체의 **성질**(속성)을 하나씩 바꿔 가며, 같은 장소에서도 고무공, 얼음 위 상자, 묵직한 상자가 서로 다르게 움직이도록 만들어 봅니다.

- `isStatic`으로 움직이는 물체와 고정된 물체를 구분할 수 있어요.
- `friction`, `restitution`, `density`, `frictionAir`가 각각 어떤 움직임을 바꾸는지 실험으로 설명할 수 있어요.
- `Bodies.circle`, `Bodies.rectangle`, `Bodies.polygon`으로 모양이 다른 물체를 만들 수 있어요.
- `angle`이 라디안 단위라는 것을 알고, CSS의 `rotate`와 연결해서 값을 정할 수 있어요.
- 코드를 보고 결과를 먼저 예측한 뒤, 실행해서 맞았는지 확인할 수 있어요.

**오늘 수업 순서 (100분)**

| 시간 | 할 일 |
|---|---|
| 전반 50분 | 지난주 복습 → 개념 알아보기 → 함께 실험하기 |
| 쉬는 시간 | |
| 후반 50분 | 미션 A(얼음 경사로) → 미션 B → 도전 미션 → 정리 |

## 시작: 같은 높이에서 떨어뜨렸는데 왜 다를까요?

지난주에 만든 월드를 잠깐 떠올려 볼게요. 물체를 만들고 `World.add`로 놀이판에 올리면, `Runner`가 계산을 반복하고 `Render`가 화면에 그려 줬어요.

이제 생활 속 장면을 상상해 보세요. 아래 질문의 답을 먼저 머릿속으로(또는 공책에) 적어 보세요.

1. 고무공과 볼링공을 같은 높이에서 바닥에 떨어뜨리면, 어느 쪽이 더 높이 튈까요?
2. 같은 나무 상자를 마른 교실 바닥과 얼음판 위에서 똑같이 밀면, 어느 쪽에서 더 멀리 미끄러질까요?
3. 같은 크기의 공이라도 종이로 만든 공과 쇠로 만든 공은 손으로 굴릴 때 느낌이 어떻게 다를까요?

우리는 이미 정답을 어느 정도 알고 있어요. 오늘 할 일은 이 **느낌**을 코드의 **숫자**로 바꿔 보는 거예요. 숫자를 바꾸면 움직임이 어떻게 달라지는지 눈으로 보면서 감을 잡아 봅니다.

## 왜 물체의 성질을 바꿔 볼까요?

물체가 모두 똑같이 움직이면 게임이 단조로워요. 통통 튀는 공, 미끄러운 얼음 바닥, 꿈쩍도 않는 바위, 가볍게 날아가는 풍선처럼 **서로 다른 성격**이 있어야 재미있는 게임이 됩니다.

Matter.js에서는 이런 성격을 물체를 만들 때 넣는 **옵션 객체**의 속성 몇 개로 정해요. 앞으로 5주차에는 힘으로 물체를 밀어 보고, 6주차에는 충돌했을 때 점수를 올릴 거예요. 그때 물체가 어떻게 움직이는지 내 마음대로 조절할 수 있어야 게임을 설계할 수 있어요.

> 한 가지 약속! Matter.js의 `friction`, `restitution`, `density` 같은 값은 **게임 속 움직임을 조절하는 숫자**예요. 과학 시간에 측정하는 실제 마찰력이나 질량의 값과 똑같이 맞춰지는 것은 아니에요. 그래서 "얼음의 마찰은 0.02"처럼 현실의 값을 외우지 않고, 숫자를 바꿔서 **눈으로 비교**하는 데 집중해요.

## 핵심 개념

### 정적(isStatic) 물체와 움직이는 물체

> **정의:** `isStatic: true`인 물체는 중력이나 부딪힘에도 움직이지 않고 제자리에 고정되는 물체예요.
>
> `Bodies.rectangle(400, 420, 800, 40, { isStatic: true })`

지난주 바닥, 벽, 발판이 모두 `isStatic: true`였어요. 이 물체는 다른 물체와 부딪히면 **상대를 막아 주지만 자기는 밀리지 않아요**. 반대로 `isStatic`을 쓰지 않은 공과 상자는 움직이는 물체예요. 게임에서 땅, 벽, 경사로는 고정하고 공, 캐릭터, 상자는 움직이게 만드는 경우가 많아요.

### 모양 — 원, 사각형, 다각형

> **정의:** 물체의 모양은 어떤 `Bodies` 도구로 만들었는지에 따라 정해져요.
>
> `Bodies.circle(x, y, 반지름)` · `Bodies.rectangle(x, y, 너비, 높이)` · `Bodies.polygon(x, y, 변의 수, 반지름)`

- 원은 어느 방향으로든 잘 굴러요.
- 사각형은 평평한 면이 있어서 바닥에 잘 앉고 쌓아 올리기 좋아요.
- 다각형은 변의 개수로 모양이 정해져요. 변이 3개면 삼각형, 5개면 오각형이고, 변이 많아질수록 원에 가까워지며 굴러가는 모습도 부드러워져요. (`x`, `y`는 모두 물체의 **가운데** 위치예요.)

### 마찰 — friction

> **정의:** `friction`은 물체의 표면이 다른 물체 표면과 맞닿아 있을 때 얼마나 잘 미끄러지지 않는지를 조절하는 값이에요.
>
> `friction: 0`이면 쭉 미끄러지고, 커질수록 덜 미끄러워요. (경사로에서는 0이 아니면 기어가거나 굴러요. 기울어진 채 쭉 미끄러지는 건 0일 때예요.)

마른 신발 바닥과 얼음판을 떠올려 보세요. 얼음 위에서는 미끄러지기 쉽죠. `friction`을 0으로 하면 얼음처럼 미끄럽고, 크게 하면 고무 매트처럼 잘 붙잡는 느낌이 나요. 미끄러움은 원래 맞닿는 두 물체가 함께 만들어요. 그런데 `isStatic: true`인 물체(바닥, 경사로)는 엔진이 `friction`을 1로 고정해 버려서, 우리가 적은 값이 **소용없어요**. (두 물체가 맞닿으면 둘의 `friction` 중 더 작은 값이 쓰여요. 고정된 경사로는 엔진이 1로 정해 두니까, 상자 값을 낮추면 그 값이 쓰여요.)

### 반발 — restitution

> **정의:** `restitution`은 부딪힌 뒤에 얼마나 튕겨 나가는지를 조절하는 값이에요.
>
> `restitution: 0` 이면 거의 튕기지 않고, 값이 커질수록 더 통통 튀어요. (보통 0~1 사이에서 시작해 보세요.)

고무공은 바닥에 부딪히면 튀어 오르고, 찰흙 덩어리는 거의 안 튀죠. 이 차이를 `restitution` 값으로 만들어요. 공이 잘 안 튄다면 먼저 **공 자신의 `restitution`**을 올려 보세요. (고정된 바닥을 만들 때 옵션에 적은 `restitution`은 엔진이 무시해요.)

### 밀도 — density는 "무게"가 아니에요

> **정의:** `density`는 물체의 같은 크기 안에 얼마나 많은 재료가 꽉 차 있는지를 나타내는 값이에요. 엔진은 이 값과 물체의 크기를 이용해 움직이기 어려운 정도를 계산해요.
>
> `density: 0.001` 이 기본값이에요. 값이 클수록 같은 크기에서도 더 묵직하게 계산돼요.

`density`와 질량, 무게는 서로 **다른 말**이에요. 풍선과 쇠공을 같은 크기로 만든다면 쇠공이 더 꽉 차 있다고(밀도가 크다고) 말할 수 있어요. 하지만 풍선이 아주 커지면, 밀도가 낮아도 커다란 만큼 전체 양은 늘어날 수 있어요. 그래서 `density`는 "얼마나 꽉 찼는가", 크기까지 합친 "얼마나 많은가"는 따로 생각해야 해요. 오늘은 같은 크기끼리 `density`만 바꿔서 부딪힐 때 누가 더 밀려나는지를 눈으로 비교해 볼 거예요.

### 공기저항 — frictionAir

> **정의:** `frictionAir`는 물체가 공기 속을 움직일 때 속도가 얼마나 줄어드는지를 조절하는 값이에요.
>
> `frictionAir: 0.01` 이 기본값이에요. 값이 커질수록 느리게 떨어지고 움직임이 금방 느려져요.

종이컵과 쇠공을 높은 곳에서 떨어뜨리면 종이컵이 더 천천히 떨어져요. 공기가 막아 주는 정도가 다르기 때문이에요. 게임에서는 풍선처럼 둥둥 떠다니는 물체를 만들 때 `frictionAir`를 키워 볼 수 있어요.

### 각도 — angle은 라디안이에요

> **정의:** `angle`은 물체가 얼마나 기울어져 있는지를 나타내는 값이고, 단위는 도(°)가 아니라 **라디안**이에요.
>
> `180° = Math.PI` 이므로 `도 × Math.PI / 180 = 라디안`

CSS에서 상자를 기울일 때 이렇게 썼던 것을 떠올려 볼게요.

```css
.box { transform: rotate(45deg); }
```

이때 `45deg`는 "45도만큼 돌려라"라는 뜻이에요. Matter.js의 `angle`도 똑같이 "얼마나 돌렸는가"를 말하는데, 단위가 다를 뿐이에요.

| CSS | Matter.js `angle` | 느낌 |
|---|---|---|
| `rotate(0deg)` | `0` | 돌리지 않음 |
| `rotate(30deg)` | `Math.PI / 6` | 살짝 기울어진 경사 |
| `rotate(45deg)` | `Math.PI / 4` | 비스듬한 경사 |
| `rotate(90deg)` | `Math.PI / 2` | 직각으로 세움 (가로 막대가 세로 막대로) |
| `rotate(180deg)` | `Math.PI` | 반 바퀴 돌려 거꾸로 뒤집음 |

`Math.PI`는 반 바퀴(180°)에 해당하는 값이라고 외워 두면 편해요. 그러면 `Math.PI / 2`는 반의 반이니 90°, `Math.PI / 4`는 45°가 되겠죠. 도 단위가 편하다면 코드에서 직접 바꿔 써도 돼요.

```js
const deg = 30;
const angle = deg * Math.PI / 180;   // 30도 → 라디안
```

비슷한 점이 하나 더 있어요. 둘 다 물체의 **가운데를 중심으로** 돌고, 화면에서 시계 방향으로 돌아가는 값이 양수예요. 그래서 오른쪽이 아래로 내려가는 경사로를 만들고 싶다면 `angle`을 양수로 시작해 보면 돼요. 방향이 반대가 되면 부호를 바꾸세요.

## 함께 만들기: 속성 실험 놀이터

지금까지 배운 속성을 하나씩 바꿔 가며 실험해 봅니다. 아래 네 단계는 모두 독립된 HTML이라서 한 단계씩 따로 실행할 수 있어요.

### 단계 1 — 고정된 것과 움직이는 것, 모양 비교하기

먼저 코드를 보지 말고 장면만 예측해 보세요.

```reflection title="단계 1 실행 전 예측"
1. 위에서 원, 사각형, 오각형이 같은 높이에서 동시에 떨어지면 어느 모양이 가장 먼저 멈출까요? 그렇게 생각한 이유는 무엇인가요?
2. 경사로(고정된 기울어진 판)에 닿으면 세 물체가 각각 어떻게 움직일 것 같나요?
3. 경사로에 isStatic: true가 없다면 어떻게 될까요?
```

```html playground title="단계 1: 모양과 isStatic 비교" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>단계 1: 모양과 isStatic</title>
  <style>
    html, body { margin: 0; min-height: 100%; background: #eef3ed; }
    body { display: grid; place-items: center; }
    canvas { display: block; max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js"></script>
  <script>
    const { Engine, Render, Runner, World, Bodies, Events } = Matter;

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

    // 왼쪽: 고정된 경사로 (angle은 라디안, Math.PI / 8 은 22.5도)
    const ramp = Bodies.rectangle(230, 230, 360, 18, {
      isStatic: true,
      angle: Math.PI / 8,
      render: { fillStyle: "#8a6b49" },
    });

    // 경사로에 떨어뜨릴 세 물체: 원, 사각형, 오각형
    const circle = Bodies.circle(90, 60, 28, {
      render: { fillStyle: "#4f82a8" },
    });
    const box = Bodies.rectangle(170, 60, 56, 56, {
      render: { fillStyle: "#d66b45" },
    });
    const pentagon = Bodies.polygon(250, 60, 5, 30, {   // 변 5개, 반지름 30
      render: { fillStyle: "#e7b84b" },
    });

    // 오른쪽: 고정된 판(isStatic: true)과 고정하지 않은 판 비교
    const fixedPlank = Bodies.rectangle(530, 220, 140, 16, {
      isStatic: true,
      render: { fillStyle: "#586b4d" },
    });
    const loosePlank = Bodies.rectangle(700, 220, 140, 16, {
      isStatic: false,   // 고정하지 않으면 중력을 받아요
      render: { fillStyle: "#b9503a" },
    });
    const ballOnFixed = Bodies.circle(530, 150, 20, {
      render: { fillStyle: "#4f82a8" },
    });
    const ballOnLoose = Bodies.circle(700, 150, 20, {
      render: { fillStyle: "#4f82a8" },
    });

    World.add(engine.world, [
      ground, leftWall, rightWall, ramp,
      circle, box, pentagon,
      fixedPlank, loosePlank, ballOnFixed, ballOnLoose,
    ]);

    // 설명 글자 (화면에 그려 주기만 해요)
    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.fillStyle = "#333";
      ctx.font = "14px sans-serif";
      ctx.fillText("고정된 경사로", 150, 40);
      ctx.fillText("isStatic: true", 465, 40);
      ctx.fillText("isStatic: false", 635, 40);
    });

    Render.run(render);
    Runner.run(Runner.create(), engine);
  </script>
</body>
</html>
```

### 단계 2 — 반발과 밀도 실험

이번에는 같은 크기의 공 세 개가 있어요. 공 이름은 `rubberBall`, `clayBall`, `heavyBall`입니다. 코드의 옵션 값을 읽기 전에, 이름만 보고 어떻게 움직일지 먼저 적어 보세요.

```reflection title="단계 2 실행 전 예측"
1. 바닥에 떨어졌을 때 가장 높이 튀는 공은 누구일 것 같나요?
2. 세 공이 한곳에 모일 때, 부딪혀서 가장 덜 밀려나는 공은 누구일 것 같나요?
3. 이 결과는 restitution과 density 중 어느 값 때문이라고 생각하나요?
```

```html playground title="단계 2: restitution과 density 비교" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>단계 2: 반발과 밀도</title>
  <style>
    html, body { margin: 0; min-height: 100%; background: #eef3ed; }
    body { display: grid; place-items: center; }
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

    // 세 공의 크기(반지름 30)는 모두 같아요. 다른 것은 아래 옵션 값뿐이에요.
    const rubberBall = Bodies.circle(220, 150, 30, {
      restitution: 0.9,   // 잘 튀어요
      density: 0.001,
      render: { fillStyle: "#4f82a8" },
    });
    const clayBall = Bodies.circle(580, 150, 30, {
      restitution: 0.1,   // 거의 안 튀어요
      density: 0.001,
      render: { fillStyle: "#c98f6b" },
    });
    const heavyBall = Bodies.circle(400, 150, 30, {
      restitution: 0.3,
      density: 0.01,      // 같은 크기에서 더 묵직하게 계산돼요
      render: { fillStyle: "#444a52" },
    });

    // 양쪽 공을 가운데 공 쪽으로 살짝 밀어서 부딪히게 해요
    Body.setVelocity(rubberBall, { x: 5, y: 0 });
    Body.setVelocity(clayBall, { x: -5, y: 0 });

    World.add(engine.world, [ground, leftWall, rightWall, rubberBall, clayBall, heavyBall]);

    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.fillStyle = "#333";
      ctx.font = "14px sans-serif";
      ctx.fillText("rubberBall (파랑)", 150, 30);
      ctx.fillText("heavyBall (회색)", 335, 30);
      ctx.fillText("clayBall (갈색)", 520, 30);
    });

    Render.run(render);
    Runner.run(Runner.create(), engine);
  </script>
</body>
</html>
```

### 단계 3 — 얼음 위 상자와 공기저항

미끄러운 상자(`iceBox`, `friction: 0`)와 잘 안 미끄러지는 상자(`rubberBox`, `friction: 1`, 천천히 기어가요)를 **똑같은 경사로 두 개**(상자마다 하나씩)에 올려 놓았어요. 경사로는 둘 다 같고, 다른 것은 상자의 `friction`뿐이에요. 또 같은 크기의 공 두 개에 `frictionAir`를 다르게 준 장면도 있어요.

```reflection title="단계 3 실행 전 예측"
1. 경사로 끝에서 어느 상자가 먼저 바닥에 닿을까요? 경사로에서 아예 멈춰 버리는 상자가 있을까요?
2. 공기저항이 큰 공과 작은 공 중 어느 쪽이 먼저 떨어질까요?
3. rubberBox의 friction을 1에서 0.5로, 다시 0.1로 바꾸면 움직임이 어떻게 달라질까요? 0.1과 0은 같을까요, 다를까요? (실행해서 확인해 보세요. 의외의 결과가 나올 수 있어요!)
```

```html playground title="단계 3: friction과 frictionAir 비교" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>단계 3: 마찰과 공기저항</title>
  <style>
    html, body { margin: 0; min-height: 100%; background: #eef3ed; }
    body { display: grid; place-items: center; }
    canvas { display: block; max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js"></script>
  <script>
    const { Engine, Render, Runner, World, Bodies, Events } = Matter;

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

    // 같은 모양, 같은 각도(Math.PI / 9 = 20도)의 경사로 두 개
    const rampAngle = Math.PI / 9;
    const rampLeft = Bodies.rectangle(135, 240, 250, 16, {
      isStatic: true,
      angle: rampAngle,
      render: { fillStyle: "#8a6b49" },
    });
    const rampRight = Bodies.rectangle(405, 240, 250, 16, {
      isStatic: true,
      angle: rampAngle,
      render: { fillStyle: "#8a6b49" },
    });

    // 크기는 같고 friction만 다른 상자
    const iceBox = Bodies.rectangle(70, 160, 50, 50, {
      friction: 0,       // 아주 미끄러워요
      render: { fillStyle: "#9ed0e6" },
    });
    const rubberBox = Bodies.rectangle(340, 160, 50, 50, {
      friction: 1,       // 잘 안 미끄러져요 (천천히 기어가요)
      render: { fillStyle: "#d66b45" },
    });

    // 크기는 같고 frictionAir만 다른 공
    const lightAirBall = Bodies.circle(620, 40, 24, {
      frictionAir: 0.001,   // 공기저항 아주 작음
      render: { fillStyle: "#4f82a8" },
    });
    const heavyAirBall = Bodies.circle(730, 40, 24, {
      frictionAir: 0.1,     // 공기저항 큼
      render: { fillStyle: "#e7b84b" },
    });

    World.add(engine.world, [
      ground, leftWall, rightWall, rampLeft, rampRight,
      iceBox, rubberBox, lightAirBall, heavyAirBall,
    ]);

    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.fillStyle = "#333";
      ctx.font = "14px sans-serif";
      ctx.fillText("iceBox (friction 0)", 40, 30);
      ctx.fillText("rubberBox (friction 1)", 300, 30);
      ctx.fillText("frictionAir 0.001", 570, 120);
      ctx.fillText("frictionAir 0.1", 690, 120);
    });

    Render.run(render);
    Runner.run(Runner.create(), engine);
  </script>
</body>
</html>
```

### 단계 4 — angle과 CSS rotate 비교하기

화면 왼쪽에는 CSS `transform: rotate(...)`로 기울인 상자를, 오른쪽에는 Matter.js `angle`로 기울인 판자를 나란히 보여 줘요. 각도가 맞는지 눈으로 비교하고, 숫자를 바꿔서 직접 같은 모양을 만들어 보세요.

```html playground title="단계 4: CSS rotate와 angle 비교" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>단계 4: angle과 CSS rotate</title>
  <style>
    html, body { margin: 0; height: 100%; background: #eef3ed; font-family: sans-serif; }
    .row { display: flex; justify-content: center; gap: 16px; padding-top: 8px; }
    .panel { width: 380px; height: 400px; background: #fff; border: 1px solid #c9d3c4; position: relative; }
    .panel h3 { margin: 8px; font-size: 14px; }
    .css-stage { position: absolute; left: 0; right: 0; top: 0; bottom: 0; display: grid; place-items: center; }
    .css-plank { width: 260px; height: 24px; background: #8a6b49; }
    canvas { display: block; }
  </style>
</head>
<body>
  <div class="row">
    <div class="panel">
      <h3 id="cssLabel"></h3>
      <div class="css-stage"><div class="css-plank" id="cssPlank"></div></div>
    </div>
    <div class="panel" id="matterPanel">
      <h3 id="matterLabel" style="position:absolute; z-index:1;"></h3>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js"></script>
  <script>
    const { Engine, Render, Runner, World, Bodies } = Matter;

    const deg = 30;                       // 도(°)로 쓴 각도
    const angle = Math.PI / 6;            // 같은 각도를 라디안으로 쓴 값 (30도)

    // 왼쪽: CSS는 도(deg)로 기울여요
    document.getElementById("cssPlank").style.transform = "rotate(" + deg + "deg)";
    document.getElementById("cssLabel").textContent = "CSS: rotate(" + deg + "deg)";

    // 오른쪽: Matter.js는 라디안으로 기울여요
    document.getElementById("matterLabel").textContent =
      "Matter.js: angle = " + angle.toFixed(3) + " (" + (angle * 180 / Math.PI).toFixed(0) + "도)";

    const engine = Engine.create();
    const render = Render.create({
      element: document.getElementById("matterPanel"),
      engine,
      options: { width: 380, height: 400, wireframes: false, background: "#ffffff" },
    });

    const plank = Bodies.rectangle(190, 200, 260, 24, {
      isStatic: true,      // 고정해서 기울기만 눈으로 비교해요
      angle: angle,
      render: { fillStyle: "#8a6b49" },
    });
    World.add(engine.world, [plank]);

    Render.run(render);
    Runner.run(Runner.create(), engine);
  </script>
</body>
</html>
```

### 실행하고 관찰하기

1. 각 카드의 **▶ 실행**을 누르기 전에 위 예측 칸에 먼저 내 생각을 적으세요.
2. 실행하고 예측과 맞았는지 비교해요. 틀렸다면 **왜 달랐는지**를 한 줄로 적어 보세요.
3. 한 번에 속성 **하나만** 바꾸세요. 두 개를 동시에 바꾸면 무엇 때문에 달라졌는지 알 수 없어요.
   - 예: `restitution: 0.9` → `0.3`으로 바꾸고 다시 실행해 튀는 높이를 비교해요.
   - 예: 단계 3의 `rubberBox`의 `friction`을 `1`, `0.5`, `0.1`, `0`으로 차례로 바꿔 보세요. 0이 아니면 상자가 느리게 기어가듯 움직이고, 진짜 미끄러지는 건 `0`일 때예요.
4. 단계 2에서는 `density` 숫자만 바꿔 보고, 공 크기는 바꾸지 마세요. 크기까지 바꾸면 `density`의 영향인지 크기의 영향인지 섞여요.
5. 단계 4에서는 `Math.PI / 6`을 `Math.PI / 3`으로 바꿔 보고, 이 숫자가 몇 도인지 CSS의 `deg`로 바꿔 말해 보세요.
6. (선택) 내 컴퓨터에서 해 보려면 VS Code에서 `index.html`로 저장하고 Live Server의 **Go Live**를 누르세요. CDN을 쓰므로 인터넷 연결이 필요해요. 인터넷이 없으면 3주차처럼 `matter.min.js`를 내려받아 같은 폴더에 두고 `<script src="matter.min.js"></script>`로 연결해요.

## 미션 A: 미끄러운 얼음 경사로 설계하기

이번 미션은 조건에 맞는 장면을 **내가 직접 설계**하는 거예요. 반드시 코드를 쓰기 전, 그리고 실행하기 전에 예측을 적어 보세요.

**미션 상황:** 꼭대기에서 상자가 출발해 얼음 경사로를 미끄러져 내려오고, 아래쪽에서 고무공이 통통 튀어 올라야 해요.

```reflection title="미션 A 예측 기록 (코드를 쓰기 전에!)"
1. 얼음처럼 미끄러운 느낌을 내려면 어느 물체의 friction을 바꿔야 할까요? 경사로일까요, 상자일까요? 그 이유는 무엇인가요?
2. 상자와 공 중 어느 쪽에 restitution을 크게 줘야 할까요?
3. 내가 정한 값(angle, friction, restitution, density)을 미리 적어 보세요.
4. 실행했을 때 어떤 일이 일어날 거라고 예상하나요? 한 문장으로 적어 보세요.
```

- **해야 할 일:** 아래 시작 코드에서 `// ✏️` 표시를 채워, 고정된 얼음 경사로 하나와 상자(`iceBox`), 고무공(`rubberBall`)을 완성하세요. 경사로는 `angle`을 정하고(예: `Math.PI / 6`), 얼음처럼 미끄러운 느낌을 내세요. 각도는 `Math.PI / 12`~`Math.PI / 6` 사이에서 정하세요(너무 가파르면 상자가 경사로에 끼어요).
- **시작 코드 읽는 법:** 시작 코드에서 상자의 `friction`은 `0.5`예요.
- **완료 조건:**
  1. 경사로는 `isStatic: true`이고 `angle`이 0이 아니에요. (라디안으로 쓰세요. 몇 도인지 주석으로 적어 보세요.)
  2. 상자가 구르거나 기어가지 않고, 기울어진 채로 **쭉 미끄러져** 내려와요.
  3. 고무공은 바닥에 떨어졌을 때 **눈에 띄게 튀어요.**
  4. 처음 적은 예측과 실제 결과를 비교하고, 달랐던 점과 이유를 한 줄로 적었어요.
  5. 속성 중 하나 이상은 일부러 값을 바꿔 보고, 바꾸기 전후의 차이를 말로 설명할 수 있어요.

```html playground title="미션 A 시작 코드: 얼음 경사로" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>미션 A: 미끄러운 얼음 경사로</title>
  <style>
    html, body { margin: 0; min-height: 100%; background: #eef3ed; }
    body { display: grid; place-items: center; }
    canvas { display: block; max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js"></script>
  <script>
    const { Engine, Render, Runner, World, Bodies } = Matter;

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

    // 경사로: 고정되어 있고(isStatic), 기울어져 있어요
    const ramp = Bodies.rectangle(330, 220, 520, 20, {
      isStatic: true,
      angle: 0,          // ✏️ 라디안으로 바꾸세요 (예: Math.PI / 6). Math.PI / 6보다 크게 하면 상자가 경사로에 끼어요. 몇 도인지 주석으로 적어 보세요.
      render: { fillStyle: "#9ed0e6" },
    });

    // 경사로를 미끄러져 내려올 상자
    const iceBox = Bodies.rectangle(150, 40, 60, 60, {
      friction: 0.5,     // ✏️ 미끄러움은 여기서 정해요. 단계 3의 iceBox는 얼마였나요?
      render: { fillStyle: "#d66b45" },
    });

    // 아래에서 통통 튀어야 하는 고무공
    const rubberBall = Bodies.circle(620, 100, 28, {
      restitution: 0,    // ✏️ 눈에 띄게 튀려면?
      render: { fillStyle: "#4f82a8" },
    });

    World.add(engine.world, [ground, leftWall, rightWall, ramp, iceBox, rubberBall]);

    Render.run(render);
    Runner.run(Runner.create(), engine);
  </script>
</body>
</html>
```

<details>
<summary>힌트 1: 어디부터 시작할까요?</summary>

경사로는 `Bodies.rectangle(x, y, 너비, 높이, 옵션)`으로 만들고, 옵션 객체 안에 `isStatic`, `angle`, `friction`을 함께 적어요. 상자와 공도 같은 방식으로, 필요한 속성만 옵션 안에 넣어요.

</details>

<details>
<summary>힌트 2: 상자가 미끄러지지 않고 굴러가거나 기어가요</summary>

상자의 `friction`이 0이 아니면 작은 값이어도 기어가거나, 떨어질 때 모서리가 걸려 데굴데굴 굴러갈 수 있어요. 0.01처럼 작은 값도 마찬가지로 기어가거나 구르고, 기울어진 채 쭉 미끄러지는 건 0일 때뿐이에요. 단계 3에서 `iceBox`는 `friction`을 얼마로 줬는지 떠올려 보세요. 고정된 경사로의 `friction`은 효과가 없으니, **움직이는 상자**의 값을 확인해 보세요.

</details>

<details>
<summary>힌트 3: 공이 튀지 않아요</summary>

공 자신의 `restitution`을 먼저 올려 보세요. 단계 2에서 잘 튀던 `rubberBall`은 값이 얼마였는지 떠올려 보세요.

</details>

## 미션 B: 누가 더 튈까? 순서 맞히기

단계 2에서 만든 공 세 개와 똑같이, 같은 크기의 공 네 개를 떨어뜨리는 장면을 만들 거예요. 공마다 `restitution`을 다르게 주고, **실행하기 전에** 높이 튀는 순서를 예측하세요.

- **해야 할 일:** 같은 크기, 같은 높이에서 출발하는 공 네 개를 만들고 `restitution`만 다르게 하세요.
- **완료 조건:**
  1. 실행하기 전에 튀는 높이 순서를 적었어요.
  2. 실행해서 예측과 비교했고, 순서가 같은지 다른지 결과를 한 줄로 적었어요.
  3. 공의 색을 다르게 해서 어느 공이 어떤 값인지 구분할 수 있어요.
  4. `density`나 크기는 바꾸지 않았어요. 이유를 한 문장으로 설명할 수 있어요.

<details>
<summary>힌트: 처음 코드는 어떻게 시작하죠?</summary>

3주차와 단계 2의 코드 구조를 그대로 가져와도 좋아요. 공을 하나 만든 뒤 위치(x)와 색, `restitution` 값만 바꿔 네 개로 늘리면 돼요.

</details>

## 도전 미션: 나만의 속성 장치 만들기

세 가지 모양(원, 사각형, 다각형)과 세 가지 속성 이상을 사용해서 "공이 지나가는 길"을 설계해 보세요.

- **해야 할 일:** 고정된 경사로 두 개 이상과 움직이는 물체 세 개 이상을 만들고, 모양과 속성이 서로 다른 물체들이 한 장면에 나오게 하세요. 이때 `Bodies.polygon`도 한 번 이상 써 보세요.
- **완료 조건:**
  1. 경사로 중 하나는 `angle`이 있고, 다른 하나는 반대 방향으로 기울어 있어요.
  2. 물체마다 `friction`, `restitution`, `density`, `frictionAir` 중 **서로 다른 속성을 하나씩 이상** 썼어요.
  3. 각 물체가 왜 그렇게 움직일지 장면 설명문을 세 줄 이상 적었어요.
  4. 친구(또는 선생님)에게 보여 주고, 의도한 것과 달라진 부분을 한 가지 찾아 고쳤어요.

## 오늘 배운 것 정리하기

- `isStatic: true`인 물체와 아닌 물체는 부딪혔을 때 어떻게 다를까요?
- `friction`, `restitution`, `frictionAir`는 각각 어떤 움직임을 바꾸나요? 내가 해 본 실험으로 말해 보세요.
- `density`가 "무게"와 다른 이유를 나만의 예시로 설명해 보세요.
- `Math.PI / 4`는 CSS의 몇 `deg`일까요? 거꾸로 `rotate(60deg)`는 `angle`로 어떻게 쓸까요?
- 오늘 예측이 가장 크게 틀렸던 곳은 어디였고, 그 이유는 무엇이었나요?
- 다음 시간에는 지금까지 우리가 놓아둔 물체를 **직접 밀어 보고 마우스로 잡아 끌어** 볼 거예요. 어떤 게임에서 쓰면 좋을지 생각해 보세요.

## 교사용 메모 (학생에게는 숨김)

- **대상 / 주차 / 수업 시간:** 중학교 1학년 1명 / 4주차 / 100분(전반 50 + 후반 50).
- **수업 흐름 예시:**
  - 전반 50분: 3주차 복습(Runner/Render/World 역할을 1분 질문으로) 5분, 시작 질문과 개념 설명 20분, 단계 1~4 실험 25분.
  - 후반 50분: 미션 A 25분(코드 쓰기 전 예측 5분 포함), 미션 B 10분, 도전·정리 15분. 시간이 모자라면 도전 미션은 다음 주 도입에서 이어 간다.
- **교과·생활 연계 시 주의:** `friction`, `restitution`, `density`, `frictionAir`는 시뮬레이션 조정값이다. 학교 과학의 마찰력·질량·밀도와 수치가 대응한다고 말하지 않는다. 특히 `density`를 질량이나 무게와 같은 말로 쓰지 않는다. 엔진은 물체의 크기(넓이)와 `density`로 질량을 계산하므로, 같은 `density`라도 큰 물체가 더 묵직하다. 학생이 "density가 큰 게 무겁다"라고 하면 "같은 크기일 때는 그렇게 보인다. 크기도 같이 봐야 한다"로 바로잡는다. 학교에서 마찰을 배우지 않았다면 생활 사례(얼음판, 고무 매트)로 감각만 쓰고 용어는 나중에 붙인다.
- **예상되는 오개념 / 막히는 지점:**
  - `angle`에 `30`처럼 도 단위를 그대로 넣어 물체가 이상하게 돈다. CSS `deg`와 비교하며 `Math.PI` 변환을 반복한다.
  - 단계 4에서 둘이 같은 방향으로 도는지 헷갈리면 양수는 화면에서 시계 방향임을 짚는다.
  - 경사로(정적 물체)의 `friction`을 낮추면 얼음이 될 거라고 생각한다. 0.19.0에서 `isStatic: true`로 만들면 생성 중 `Body.setStatic`이 실행되어 그 물체의 `friction`은 1, `restitution`은 0으로 강제되고, 옵션으로 넘긴 값은 무시된다. 정적 경사로/바닥의 `friction`·`restitution` 옵션은 바꿔도 소용없다. 미끄러움은 움직이는 상자의 `friction`이 결정한다. (접촉 시 마찰은 작은 값, 반발은 큰 값이 쓰인다. 정적 물체도 마찬가지라서 정적 경사로(1)와 상자(0)가 맞닿으면 0이 쓰인다.)
  - `friction`을 0.01 정도로만 줘도 미끄러질 거라고 기대한다. 0이 아닌 작은 값은 기어가거나 구르는 모습이 비슷하고(미션 A 배치에서 22.5~30°이면 0.01~0.9 모두 모서리로 착지해 굴러 내려가고(초속 약 60~100px), 15° 이하이면 기어간다. friction 0만 기울어진 채 미끄러진다. 단계 3 배치(20°, 경사로 바로 위 출발)에서는 기어가거나 멈춘다), 0.9여도 미끄러지지 않는다. 진짜 미끄러지려면 `friction: 0`이어야 한다.
  - 경사로를 `isStatic` 없이 만들어 같이 떨어진다.
  - 속성을 한꺼번에 여러 개 바꾸고 원인을 모른다. "하나만 바꾸기"를 상기시킨다.
  - `Bodies.polygon`의 세 번째 인자를 크기로 착각한다. 변의 개수(`sides`)가 3번째, 반지름이 4번째다.
- **도움이 필요할 때 줄 질문이나 힌트:**
  - "경사로가 얼마나 기울어 있어? CSS로 쓰면 몇 deg야?"
  - "공이 튀지 않으면 공 자신의 restitution은 얼마지? 단계 2의 rubberBall은 몇이었지?"
  - "상자가 기어가면 상자의 friction은 얼마야? 단계 3의 iceBox와 비교해 볼래?"
  - "방금 바꾼 값이 하나야, 여러 개야?"
- **함께 만들기 단계 관련:** 단계 1~4는 장면이 서로 독립적이라 `// ★` 변경 표시가 없다. 단계 3 예상 결과: iceBox는 약 2초에 경사로를 벗어나고 rubberBox는 천천히 기어간다. `Body.setVelocity`는 단계 2에서 공을 밀 때만 미리 쓰였고, 본격적인 설명은 5주차 예고다. 미션 A 시작 코드의 상자 y는 40이다(100이면 경사로 angle이 약 21° 이상일 때 시작부터 겹침을 node SAT로 확인함). 상자 y=40이면 약 33°까지는 겹치지 않고 35° 이상(`Math.PI/5`, `Math.PI/4`)에서는 시작부터 겹쳐 상자가 튕겨 나간다. 단계 3 배치(20°, 상자가 경사로 바로 위에서 출발)에서는 friction이 0이 아니면 기어가거나 멈추고, 미션 A 배치(상자 y=40 낙하)에서는 friction이 0이 아닐 때 모서리 착지로 굴러 내려갈 수 있다. 수업 전 playground에서 한 번 실행해 확인한다.
- **예측 칸별 지도 가이드:** 예측은 맞히기가 아니라 "이유를 붙여 말해 보기"가 목표다. 틀려도 점수에 영향이 없다고 먼저 말한다. 좋은 답은 결과가 맞든 틀리든 "~해서 ~일 것 같다"처럼 이유가 한 줄이라도 붙어 있다. 학생이 쓰는 동안 정답을 알려 주지 않고, 실행 뒤에 "예측과 뭐가 달랐어?"를 먼저 묻는다. 아래는 질문마다 "무엇을 알게 하려는 질문인지"와 "이런 방향이면 좋은 답"이다.
  - **단계 1 (모양과 `isStatic`)**
    - 질문 1 (어느 모양이 가장 먼저 멈출까): 의도는 **모양이 움직임을 바꾼다**는 걸 스스로 생각해 보게 하는 것이다. 좋은 답은 "동그라미는 굴러서 ~", "네모는 평평해서 ~", "오각형은 모서리가 있어서 ~"처럼 모양의 특징에서 이유를 끌어낸 답이다. 순서를 맞혔는지는 중요하지 않다. (참고: 돌려 보면 보통 원이 가장 늦게 멈춘다. 학생이 "원이 먼저"라고 해도 "구르는 건 멈추기 어려웠다"는 관찰로 이어 주면 된다.)
    - 질문 2 (경사로에 닿으면 각각 어떻게 움직일까): 의도는 질문 1의 이유를 움직임(구른다/미끄러진다/덜컹인다)이라는 말로 풀어 쓰게 하는 것이다. "굴러간다", "미끄러진다", "걸린다" 같은 동작 표현이 나오면 충분하다.
    - 질문 3 (경사로에 `isStatic: true`가 없다면): 의도는 **`isStatic`이 "중력을 안 받고 제자리에 고정"이라는 뜻**임을 확인하는 것이다. 좋은 답은 "경사로도 같이 떨어진다"이다. 이때 "그럼 바닥은 왜 안 떨어질까?"로 이어 주면 바닥과 벽에 왜 `isStatic`을 쓰는지 연결된다.
  - **단계 2 (`restitution`과 `density`)**
    - 질문 1 (가장 높이 튀는 공): 의도는 **`restitution`이 "얼마나 잘 튕기는가"**임을 생활 감각(고무공, 찰흙, 쇠공)으로 떠올리게 하는 것이다. 좋은 답은 "고무공이 제일 높이 튈 것 같다. 고무는 잘 튕기니까"이다. 정답은 `restitution`이 가장 큰 `rubberBall`이다.
    - 질문 2 (부딪혀서 가장 덜 밀려나는 공): 의도는 **`density`가 "묵직함"에 해당한다**는 걸 느끼게 하는 것이다. 좋은 답은 "제일 무거운 공이 안 밀릴 것 같다"이다. 정답은 `density`가 가장 큰 `heavyBall`이다. "density = 질량"이라고 말하면 "같은 크기일 때만 그렇다"로 바로잡는다.
    - 질문 3 (`restitution`과 `density` 중 어느 값 때문인가): 의도는 **두 값이 서로 다른 일을 한다**는 걸 구분하게 하는 것이다. 가장 좋은 답은 "높이 튄 건 `restitution` 때문이고, 안 밀려난 건 `density` 때문이다"처럼 둘을 나눠 말하는 답이다. 한 값으로만 설명하려 하면 "높이 튄 공과 안 밀려난 공이 같은 공이었어?"라고 물어 준다.
  - **단계 3 (`friction`과 `frictionAir`)**
    - 질문 1 (어느 상자가 먼저 닿나, 멈추는 상자가 있나): 의도는 **`friction`이 클수록 표면이 붙잡아 느리게 움직인다**는 걸 예측하게 하는 것이다. 좋은 답은 "얼음 상자가 먼저 내려오고, 고무 상자는 잘 안 내려온다"이다. 멈추는 상자가 있다고 답해도 괜찮다. 실행하면 고무 상자는 멈추지 않고 아주 느리게 기어간다는 점을 같이 본다.
    - 질문 2 (공기저항이 큰 공과 작은 공): 의도는 **`frictionAir`이 낙하를 늦춘다**는 걸 깃털과 돌멩이로 떠올리게 하는 것이다. 좋은 답은 "공기저항이 작은 공이 먼저 떨어진다"이다.
    - 질문 3 (`friction`을 1→0.5→0.1로 바꾸면, 0.1과 0은 같을까): 의도는 **"조금 작게"와 "아예 없음(0)"은 다른 세계**라는 걸 직접 겪게 하는 것이다. 학생 대부분은 "조금씩 더 미끄러진다"고 예측하는데, 그 예측이 빗나가는 경험 자체가 목적이다. 0.1에서도 여전히 기어가고 0일 때만 쭉 미끄러진다. 빗나갔을 때는 설명하지 말고 "0.1이랑 0은 뭐가 다르게 보였어?"라고 묻는다.
  - **미션 A 예측 기록**
    - 질문 1 (경사로 / 상자 중 어느 쪽 `friction`): 의도는 **미끄러움은 "닿는 두 물체"가 함께 정하고, 고정된 물체의 `friction`은 엔진이 정해 둔다**는 걸 시행착오로 알게 하는 것이다. 정답 방향은 "상자"다. 학생이 "경사로"라고 쓰면 틀렸다고 말하지 말고, 경사로 값을 바꿔 아무 변화가 없는 걸 직접 보게 한다. 이 경험이 이해를 만든다.
    - 질문 2 (상자/공 중 `restitution`을 크게 줄 쪽): 의도는 **튀는 건 공의 값이 정한다**는 걸 단계 2와 연결하는 것이다. 정답 방향은 "공"이다. 이유로 "공이 튀어야 하니까"만 써도 충분하다.
    - 질문 3 (내가 정한 값 적기): 정답이 없다. 의도는 코드를 쓰기 전에 값을 **미리 정해 보는 습관**이다. 앞 질문의 이유와 값이 맞는지만 본다. `angle`을 도(예: 30)로 적으면 라디안으로 바꾸도록 짚어 준다.
    - 질문 4 (어떤 일이 일어날지 한 문장): 의도는 **실행 뒤 예측과 비교할 기준**을 남기는 것이다. "상자가 미끄러져 내려와 공을 쳐서 공이 튄다"처럼 눈에 보이는 장면을 한 문장으로 쓰면 좋다. 실행 뒤 이 문장과 다른 점을 채점 기준 (4)의 한 줄로 쓰게 한다.
- **미션 A 예시 답안 / 채점 기준:**

  ```js
  const ramp = Bodies.rectangle(330, 220, 520, 20, {
    isStatic: true,
    angle: Math.PI / 8,      // 약 22.5도 (경사로의 friction은 쓰지 않는다: 정적 물체라 무시됨)
    render: { fillStyle: "#9ed0e6" },
  });
  const iceBox = Bodies.rectangle(150, 40, 60, 60, {
    friction: 0,             // 얼음: 정확히 0이어야 쭉 미끄러진다
    render: { fillStyle: "#d66b45" },
  });
  const rubberBall = Bodies.circle(620, 100, 28, {
    restitution: 0.9,
    render: { fillStyle: "#4f82a8" },
  });
  ground.restitution = 0.8; // (선택) 바닥에서도 더 튀게 하려면 생성 후 대입한다. 생성 옵션에 넣은 값은 무시된다.
  ```

  채점 기준: (1) 경사로가 `isStatic`이고 `angle`이 라디안으로 쓰였다(`30` 같은 도 값이 아니다). (2) 상자가 구르거나 기어가지 않고 기울어진 채 쭉 미끄러진다(상자의 `friction`이 0이다. 0.01처럼 작아도 0이 아니면 기어가거나 구르므로 조건 미충족). 기어가거나 구르면 상자 `friction`을 0으로 낮춘다. (3) 공이 눈에 띄게 튄다(공 자신의 `restitution` 0.6 이상 권장). (4) 예측과 결과를 비교한 한 줄이 있다. (5) 속성을 바꾼 전후 차이를 설명한다. 정확한 숫자는 학생마다 다를 수 있으므로 값이 아니라 **조건 충족과 설명**을 평가한다.
- **미션 B 예시 답안:** 같은 `Bodies.circle(x, 50, 24, { restitution: r })`을 `r = 0.2, 0.5, 0.8, 0.95`로 네 개 만들고 x를 달리해 서로 닿지 않게 둔다. 공끼리의 순서 비교가 목적이므로 바닥은 기본 그대로 둬도 된다(반발은 두 값 중 큰 쪽이 쓰인다). 더 높이 튀게 하고 싶으면 생성 후 `ground.restitution = 0.8`처럼 대입한다. 기대 결과는 `restitution`이 클수록 더 높이 튀는 것이다.
- **도전 미션 예시:** 한쪽은 `angle: Math.PI / 10`, 다른 쪽은 `angle: -Math.PI / 10`인 고정 경사로 두 개, 그 위에 `Bodies.polygon(x, y, 5, 28, { restitution: 0.5 })`, `Bodies.circle(..., { frictionAir: 0.1 })`, `Bodies.rectangle(..., { density: 0.01 })`. 각 물체의 설명문이 코드의 속성과 맞는지 확인한다.
- **다음 수업을 위해 기록할 관찰:** 학생이 `angle`을 도·라디안 중 어느 쪽으로 먼저 생각하는지, 속성 하나만 바꾸는 습관이 생겼는지, 예측과 결과가 크게 달랐던 속성이 무엇인지 메모한다. 5주차에서 `applyForce`와 `setVelocity`를 쓸 때 `density`(묵직함)가 힘의 효과에 영향을 준다는 점으로 연결한다.
