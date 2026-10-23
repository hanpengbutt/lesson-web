# 3주차: Matter.js가 물리 계산을 대신해요

## 오늘 해볼 일

지난주에는 공의 위치와 속도를 직접 바꾸고, 바닥에 닿았는지도 직접 확인했어요. 오늘은 Matter.js를 불러와 물체 여러 개가 부딪히고 쌓이는 장면을 만들어 봅니다.

- Matter.js가 어떤 계산을 맡는지 설명할 수 있어요.
- `Engine`, `World`, `Bodies`, `Runner`, `Render`의 역할을 구분할 수 있어요.
- `Bodies`로 상자와 공을 만들고, 월드에 넣어 움직이게 할 수 있어요.
- CDN으로 Matter.js를 불러오는 이유를 설명할 수 있어요.

## 시작: 지난 시간에 느꼈던 불편함

지난 시간을 잠깐 떠올려 볼게요. 공 하나를 떨어뜨리려면 속도와 위치를 계속 바꾸고, 바닥에 닿았는지도 직접 확인해야 했어요.

```js
ball.vy += gravity;    // 속도 갱신
ball.y  += ball.vy;    // 위치 갱신

if (ball.y + ball.r > canvas.height) {   // 바닥 충돌
  ball.y  = canvas.height - ball.r;
  ball.vy = -ball.vy * BOUNCE;
}
```

지난 시간의 도전 미션처럼 공 두 개가 만났는지 확인하려면 어떨까요? 공이 10개라면 서로 다른 두 공의 짝은 **45가지**예요. 각 짝이 부딪혔는지 확인하고 움직임까지 조정하려면 코드가 빠르게 복잡해집니다. 경사면이나 여러 물체가 서로 부딪히는 상황도 직접 계산하기는 쉽지 않아요.

이런 계산을 매번 직접 쓰지 않고, 미리 만들어진 코드를 빌려 쓸 수 있다면 어떨까요? 그 역할을 하는 도구가 **물리 엔진 라이브러리**예요. 오늘 사용할 Matter.js는 JavaScript용 2D 물리 엔진으로, 우리가 물체와 규칙을 정하면 중력에 따른 움직임과 충돌 같은 계산을 반복해서 처리해 줍니다.

물리 엔진을 쓰면 매번 `update()`와 충돌 계산을 직접 만드는 수고를 줄이고, 게임 장면과 규칙을 만드는 데 더 집중할 수 있어요. 오늘은 Matter.js의 기본 부품을 조립해 상자와 공이 쌓이는 월드를 만들고, 다음 주에는 물체의 성질을 바꾸어 움직임이 어떻게 달라지는지 실험합니다.

## 핵심 개념

### CDN — 인터넷으로 코드 파일을 빌려 와요

> **정의:** CDN(Content Delivery Network)은 여러 서버에 파일을 보관해 두고, 웹사이트가 필요한 파일을 인터넷으로 받아 쓸 수 있게 해 주는 서비스예요.

Matter.js는 우리 HTML 파일에 들어 있는 코드가 아니라, 따로 불러와야 하는 외부 라이브러리예요. 브라우저가 `<script src="...">`를 읽으면 주소에 있는 JavaScript 파일을 요청해 가져온 뒤 실행합니다. 지난 시간에 Flask 서버에 페이지를 요청했던 것처럼, 이번에는 브라우저가 CDN에 Matter.js 파일을 요청하는 거예요.

| 불러오는 방법 | 예시 | 특징 |
|---|---|---|
| CDN 주소 사용 | `<script src="https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js"></script>` | 설치가 필요 없고 인터넷이 연결되어야 해요. |
| 파일을 내려받아 사용 | `<script src="matter.min.js"></script>` | 파일을 프로젝트에 함께 보관하면 인터넷 없이도 쓸 수 있어요. |

오늘은 설치 과정을 줄이기 위해 CDN을 사용합니다. 주소에 `@0.19.0`처럼 버전을 적어 두면 나중에 라이브러리가 업데이트되어도 수업 코드가 같은 버전을 불러와요. 인터넷이 없는 환경에서는 Matter.js 0.19.0 파일을 미리 내려받아 HTML 파일과 같은 폴더에 두고, 두 번째 방법으로 연결하세요.

### 다섯 부품을 장난감 놀이판으로 생각해요

> **정의:** Matter.js는 놀이판에 물체를 놓고, 심판이 움직임을 계산하고, 화면에 그 결과를 보여 주는 도구예요.

공과 상자를 놀이판 위에 올려 두고 굴리는 장면을 상상해 봅시다. 이름이 낯선 다섯 부품은 이 장면에서 맡은 일이 달라요.

| Matter.js 이름 | 놀이판 비유 | 실제로 하는 일 |
|---|---|---|
| `World` | 물체를 올려 두는 놀이판 | 공과 상자를 담아 두는 공간이에요. 코드에서는 `engine.world`가 우리가 사용할 판이고, `World.add(...)`로 물체를 올려요. |
| `Bodies` | 공·상자 모양을 찍는 틀 | 원이나 네모 물체를 만들어요. `Bodies.circle(...)`은 공, `Bodies.rectangle(...)`은 네모를 만들어요. 만들어진 물체 하나를 `body`라고 부르기도 해요. |
| `Engine` | 움직임을 판단하는 심판 | 중력 때문에 얼마나 떨어질지, 물체끼리 부딪히면 어떻게 될지 계산해요. |
| `Runner` | “다음 순간!”을 계속 외치는 박자기 | 엔진이 계산을 계속하도록 반복 실행해요. 박자기가 직접 공을 밀지는 않아요. |
| `Render` | 놀이판을 비추는 카메라와 화면 | 물체의 현재 위치를 캔버스에 그려요. 그림만 보여 주며 충돌을 계산하지는 않아요. |

여기서 `Bodies`는 물체를 만들어 주는 도구 이름이고, `body`는 그렇게 만들어진 공이나 상자 하나예요. `World`도 두 가지를 구분해 보세요. `engine.world`는 실제 놀이판이고, `World.add`의 `World`는 그 판에 물체를 넣게 해 주는 도구 이름이에요.

### 부품은 이 순서로 연결돼요

> **정의:** 물체를 만들고 판에 올리면, 엔진이 움직임을 계산하고 화면 도구가 그 결과를 그려요.
>
> `Bodies로 만들기 → World에 놓기 → Runner가 Engine을 반복 실행 → Render가 화면에 그리기`

1. `Engine.create()`로 심판과 놀이판을 준비해요. 이때 `engine.world`도 함께 생깁니다.
2. `Bodies.circle(...)`이나 `Bodies.rectangle(...)`으로 공과 상자를 만들어요.
3. `World.add(engine.world, [공, 상자, 바닥])`처럼 만든 물체를 놀이판에 올려요. 바닥은 `{ isStatic: true }`로 설정해 움직이지 않게 할 수 있어요.
4. `Runner.run(runner, engine)`을 시작하면 엔진이 다음 순간의 위치와 충돌을 반복해서 계산해요.
5. `Render.run(render)`은 그때그때의 위치를 캔버스에 보여 줘요.

그래서 `Runner`만 켜면 계산은 해도 그림이 안 보이고, `Render`만 켜면 화면은 그려도 물체가 저절로 움직이지 않아요. 둘 다 있어야 움직이는 장면을 볼 수 있습니다. Matter.js의 숫자는 실제 과학 실험의 측정값과 똑같다는 뜻이 아니라, 게임 속 움직임을 조정하는 값이에요.

![Bodies로 공과 상자를 만들고 World에 놓으면 Runner가 Engine의 계산을 반복시키고 Render가 결과를 그리는 관계](/lessons/matterjs-game/diagrams/matter-parts.svg)

화면 좌표는 왼쪽 위가 `(0, 0)`이고 오른쪽으로 갈수록 x, 아래로 갈수록 y가 커져요. 그래서 `Bodies.circle(540, 80, 28)`은 화면 오른쪽 쪽, 위쪽에 반지름 28인 공을 만든다는 뜻이에요.

### 공식 문서에서 부품 이름 찾아보기

Matter.js의 [공식 API 문서](https://brm.io/matter-js/docs/)에는 각 부품의 설명과 예제가 있어요. 페이지에서 `Engine`, `Bodies`, `Runner`, `Render`를 찾아 이름과 역할을 확인해 보세요. 문서에 표시된 버전과 오늘 실습의 CDN 버전이 다를 수 있으니, 오늘은 우선 부품 이름과 설명을 찾아 읽고 코드 예제는 수업 코드와 비교해 봅니다.

## 함께 만들기: 상자와 공이 쌓이는 월드

아래 코드는 CDN에서 Matter.js 0.19.0을 가져와 바닥과 발판, 여러 상자와 공을 만듭니다. 물체를 월드에 넣고 `Runner`와 `Render`를 실행해요.

### 실행 전에 먼저 예측해 보기

아직 ▶ 실행을 누르지 말고, 코드를 훑어보며 아래 입력칸에 내 예상과 이유를 적어 보세요. 정답을 맞히는 퀴즈가 아니라 **코드에서 근거를 찾아 예측하고, 실행 결과와 비교하는 활동**이에요. 입력한 답은 저장되거나 전송되지 않으니 수업 중 자유롭게 적으면 됩니다.

```reflection title="실행 전 예측 기록"
1. Runner.run(runner, engine)은 다음 순간에 무엇을 할까요? 화면에 그림을 그릴까요, 물체의 움직임을 계산할까요?
2. Render.run(render)은 어떤 일을 할까요? 이 줄을 잠시 주석 처리하면 물체의 움직임은 어떻게 될까요?
3. 지난 시간에는 ball.vy += gravity로 중력을 직접 적용했어요. 이번 코드에서 중력의 값을 정한 줄은 어디일까요? 실제로 물체를 움직이는 계산은 어느 부품이 맡을까요?
4. boxA, boxB, ballA, ballB, ground, platform은 각각 어떤 물체일까요? 이름과 Bodies.rectangle 또는 Bodies.circle의 인자를 보고 근거를 적어 보세요.
5. leftWall, rightWall은 화면에 보이지 않는데 왜 만들었을까요? 두 벽을 World.add(...) 목록에서 빼면 어떤 일이 생길까요?
```

답을 적은 다음 코드를 읽고, 예측에 사용한 근거가 맞는지 표시해 보세요. 실행 뒤에는 예상과 실제 결과가 달랐던 항목을 고쳐 적어도 좋아요.

```html playground title="상자와 공이 쌓이는 물리 월드" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Matter.js 물리 월드</title>
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
    engine.gravity.y = 1;

    const render = Render.create({
      element: document.body,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "#eef3ed",
      },
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
    const platform = Bodies.rectangle(540, 300, 220, 18, {
      isStatic: true,
      render: { fillStyle: "#8a6b49" },
    });

    const boxA = Bodies.rectangle(320, 80, 70, 70, {
      render: { fillStyle: "#d66b45" },
    });
    const boxB = Bodies.rectangle(380, 30, 70, 70, {
      render: { fillStyle: "#e7b84b" },
    });
    const ballA = Bodies.circle(540, 80, 28, {
      render: { fillStyle: "#4f82a8" },
    });
    const ballB = Bodies.circle(580, 30, 24, {
      render: { fillStyle: "#a46f9b" },
    });

    World.add(engine.world, [
      ground, leftWall, rightWall, platform,
      boxA, boxB, ballA, ballB,
    ]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);
  </script>
</body>
</html>
```

### 실행하고 관찰하기

1. **▶ 실행**을 눌러 상자와 공이 떨어지는 모습을 봅니다.
2. 발판 위에 공이 멈추는지, 바닥에 떨어진 상자들이 쌓이는지 확인하세요.
3. `Runner.run(...)` 줄만 주석 처리하고 다시 실행해 보세요. 물체가 움직이지 않는다면, 물리 계산과 화면 그리기 중 무엇이 멈춘 걸까요? 확인한 뒤 원래대로 돌려놓으세요.
4. `Render.run(...)` 줄만 주석 처리해 보세요. 화면에서 보이는 것과 물체의 계산은 각각 어떻게 될까요? 확인한 뒤 원래대로 돌려놓으세요.
5. `isStatic: true`를 발판에서 잠시 지우고 실행하면 어떤 차이가 있나요?
6. `leftWall`, `rightWall`을 `World.add(...)` 목록에서 빼면 물체가 어떻게 되는지 확인해 보세요.
7. 상자나 공의 `x`, `y` 숫자를 바꾸고 어느 위치에서 떨어질지 먼저 예상해 보세요.
8. 내 컴퓨터에서 실행하려면 VS Code에서 `index.html`로 저장하고 Live Server의 **Go Live**를 눌러도 됩니다. CDN을 사용하므로 인터넷 연결이 필요해요.

## 미션 A: Bodies로 계단 장면 만들기

이제 물체의 위치와 크기를 바꿔 계단이나 언덕처럼 보이는 장면을 만들어 보세요. 아래 코드는 바닥과 공 하나만 준비해 둔 출발점이에요. `// ✏️ 여기에 Bodies를 더 만들어 보세요` 자리에 움직이지 않는 발판을 적어도 네 개 추가하세요.

- **해야 할 일:** `Bodies.rectangle(...)`을 사용해 높이가 조금씩 달라지는 계단을 만들거나, 각도를 준 경사로 장면을 만드세요.
- **완료 조건:** 발판이 네 개 이상 있고, 공이 떨어져 발판에 닿거나 그 위에 멈추는 모습을 확인하세요. 각 발판이 어디에 놓였는지 좌표를 설명하세요.
- 발판에는 `isStatic: true`를 주세요. 공은 움직여야 하므로 `isStatic`을 주지 않습니다.

```html playground title="미션 A: 발판을 놓아 계단 만들기" height=450
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>나만의 계단 월드</title>
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

    const ground = Bodies.rectangle(width / 2, height - 15, width, 30, {
      isStatic: true,
      render: { fillStyle: "#586b4d" },
    });
    const ball = Bodies.circle(150, 40, 24, {
      render: { fillStyle: "#d66b45" },
    });

    // ✏️ 여기에 Bodies.rectangle(...)로 고정 발판을 네 개 이상 만들어 보세요.
    // 예: const stepA = Bodies.rectangle(300, 340, 120, 18, { isStatic: true });

    World.add(engine.world, [ground, ball]);
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);
  </script>
</body>
</html>
```

### 도전 미션: 기울어진 경사로 추가하기

계단 대신 경사로를 만들고 싶다면 `Bodies.rectangle(x, y, 너비, 높이, 옵션)`의 옵션에 `angle`을 넣어 보세요. 각도 단위는 라디안이라 처음에는 `Math.PI / 12`처럼 작은 값부터 바꿔 보는 게 좋아요.

- **해야 할 일:** 고정된 경사로를 하나 만들고 공이 경사로를 따라 움직이는 장면을 구성하세요.
- **완료 조건:** 경사로가 기울어져 있고, 공이 닿은 뒤 움직임이 달라지는 것을 확인하세요.

## 오늘 배운 것 정리하기

- 지난주에는 공의 위치와 바닥 충돌을 직접 계산했어요. 오늘 Matter.js는 어떤 일을 대신했나요?
- `World.add(...)`를 하지 않으면 새로 만든 물체는 월드에서 어떻게 될까요?
- 물리 계산을 반복하는 부품과 화면을 그리는 부품의 이름을 각각 말해 보세요.
- 다음 시간에는 물체의 어떤 성질을 바꿔 움직임을 다르게 만들 수 있을까요?

## 교사용 메모 (학생에게는 숨김)

- **대상 / 주차 / 수업 시간:** 중학교 1학년 1명 / 3주차 / 100분.
- **수업 흐름 예시:** 지난주 복습 10분, 물리 엔진과 다섯 부품 설명 20분, 함께 만들기·관찰 30분, 쉬는 시간, 미션 A 25분, 도전과 정리 15분.
- **실행 환경:** 브라우저에서 CDN을 불러오므로 인터넷 연결이 필요하다. 연결이 불안정하면 Matter.js 0.19.0 파일을 미리 내려받아 `<script src="matter.min.js"></script>`로 연결한다.
- **예상되는 오개념:** `Render`가 물리 계산도 한다고 생각할 수 있다. `Runner`는 계산을 반복하고 `Render`는 그 결과를 그린다는 점을 분리해서 확인한다. `World`는 화면 그 자체가 아니라 물체를 모아 두는 계산 공간이다.
- **예측 활동 모범답안:** `Runner.run`은 Engine 업데이트를 반복하고 `Render.run`은 결과를 화면에 그린다. `engine.gravity.y = 1`은 중력의 y 방향 성분을 설정하는 줄이다. 중력을 속도·위치에 반영하는 세부 계산은 Engine 내부에서 이루어지며, 학생에게 라이브러리 내부 코드를 찾게 하기보다 지난주 `vy += gravity`와 이번 주 중력 설정 코드를 비교하게 한다. `boxA`, `boxB`는 사각형 동적 물체, `ballA`, `ballB`는 원형 동적 물체다. `ground`, `platform`, `leftWall`, `rightWall`은 `isStatic: true`인 고정 사각형이고, 양옆 벽은 `render.visible: false`라 화면에서만 보이지 않는다. 벽을 월드에서 빼면 물체가 양옆으로 빠져나갈 수 있다. `Render.run`만 멈추면 물리 계산은 계속되지만 화면 갱신이 멈추고, `Runner.run`만 멈추면 물리 계산이 반복되지 않는다.
- **공식 문서 읽기:** 공식 API 페이지에서 `Engine`, `Bodies`, `Runner`, `Render` 항목을 찾아 짝을 맞춘다. 페이지 문서 버전과 수업의 고정 CDN 버전이 다를 수 있으므로, 오늘은 모듈의 역할을 읽고 버전별 코드 차이는 따라 쓰지 않게 안내한다.
- **미션 A 예시 설계:** `Bodies.rectangle(300, 340, 120, 18, { isStatic: true })`처럼 x를 오른쪽으로, y를 위쪽으로 조금씩 옮긴 고정 발판을 네 개 이상 둔다. 마지막에 만든 발판을 포함해 `[ground, ball, stepA, stepB, stepC, stepD]`처럼 `World.add`에 모두 전달해야 한다.
- **도전 미션 예시:** `Bodies.rectangle(500, 300, 240, 18, { isStatic: true, angle: Math.PI / 12 })`. 각도와 위치를 바꿔 공이 화면 밖으로 빠져나가지 않는지 확인한다.
- **다음 수업을 위해 기록할 점:** `isStatic`, 좌표, 각도 중 학생이 스스로 조절한 값과 관찰한 결과를 메모한다. 다음 주에는 마찰·반발·밀도 등 물체 속성 실험으로 연결한다.
