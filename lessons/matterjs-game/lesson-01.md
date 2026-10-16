# 1주차: 브라우저 화면에 그림을 그리고 움직이기

## 오늘 해볼 일

오늘은 Canvas를 그림판처럼 사용해 도형을 그리고, `requestAnimationFrame`으로 공을 움직여 봅니다. 마지막에는 키보드로 공을 조종해요.

- Canvas 2D 도구로 사각형과 원을 그리고, 이전 그림을 지울 수 있어요.
- 프레임과 FPS를 간단히 설명하고 `requestAnimationFrame`으로 매 프레임 다시 그릴 수 있어요.
- 애니메이션에서 위치를 바꾸는 부분과 그림을 그리는 부분을 구분할 수 있어요.

## 시작: 브라우저는 화면을 어떻게 갱신할까요?

화면에서 공이 오른쪽으로 움직이는 것처럼 보이려면 어떤 일이 반복되어야 할까요? 공을 한 번 그리는 것으로는 움직임이 생기지 않아요. 조금씩 다른 위치에 그린 그림을 이어서 보여 줘야 합니다.

화면이 한 번 새로 그려지는 단위를 **프레임**이라고 해요. 1초에 60번 화면이 갱신되면 60 FPS라고 부릅니다. 모든 기기가 항상 60 FPS로 동작하는 것은 아니지만, 브라우저는 화면을 그릴 준비가 된 때에 맞춰 다음 애니메이션 작업을 예약할 수 있어요.

지난 시간에 본 브라우저 그리기 과정도 떠올려 봅시다.

`DOM Tree + CSSOM Tree → Render Tree → Layout → Paint → Composite`

이 흐름은 브라우저 렌더링 과정을 이해하기 위한 대표적인 순서예요. 화면이 바뀔 때마다 항상 모든 단계가 처음부터 실행되는 것은 아닙니다. 변경된 내용에 따라 필요한 단계만 다시 수행하도록 브라우저가 최적화할 수 있어요.

웹페이지의 버튼이나 문장은 DOM 요소로 만들고, Canvas에서는 하나의 그림판에 픽셀을 그려요. Canvas가 언제나 더 빠른 것은 아니지만, 게임처럼 매 순간 위치가 바뀌는 그림을 한 화면에 직접 그릴 때 편리합니다.

## 왜 직접 만들어 볼까요?

게임 속 공은 화면에 그려져야 하고, 위치가 계속 바뀌어야 움직이는 것처럼 보여요. 오늘 Canvas와 애니메이션 루프를 직접 만들면 다음 시간에 공이 떨어지고 튀는 움직임을 코드로 표현할 수 있습니다.

## 핵심 개념

### 1. Canvas는 브라우저 안의 그림판이에요

> **정의:** Canvas는 JavaScript 그리기 도구로 픽셀 그림을 그리는 HTML 요소예요.
>
> `const ctx = canvas.getContext("2d");`

`canvas`는 그림판이고, `ctx`는 그 위에 선과 도형을 그리는 도구예요. 그림을 그릴 때마다 브라우저가 공이나 원을 별도 HTML 요소로 만드는 게 아니라, 우리가 지정한 위치에 픽셀을 칠합니다.

### 2. Canvas 2D에서 자주 쓰는 메서드

아래 표에서 **속성**은 도구의 설정값이고, **메서드**는 도구에 시키는 명령이에요.

| 이름 | 종류 | 하는 일 |
|---|---|---|
| `getContext("2d")` | 메서드 | 2D 그리기 도구를 가져와요. |
| `clearRect(x, y, 너비, 높이)` | 메서드 | 지정한 영역의 그림을 지워요. 애니메이션에서 화면을 비울 때 써요. |
| `fillRect(x, y, 너비, 높이)` | 메서드 | 색이 채워진 사각형을 바로 그려요. |
| `beginPath()` | 메서드 | 새로운 선이나 도형 경로를 시작해요. |
| `arc(x, y, 반지름, 시작각, 끝각)` | 메서드 | 원이나 원의 일부를 경로로 만들어요. |
| `fill()` | 메서드 | 경로 안쪽을 색으로 채워요. |
| `stroke()` | 메서드 | 경로의 테두리 선을 그려요. |
| `moveTo(x, y)` / `lineTo(x, y)` | 메서드 | 선의 시작점과 다음 점을 정해요. |
| `fillText(글자, x, y)` | 메서드 | 글자를 그려요. |
| `fillStyle` / `strokeStyle` | 속성 | 채우기 색 / 선 색을 정해요. |

Canvas 좌표의 `(0, 0)`은 왼쪽 위예요. x는 오른쪽으로, y는 아래쪽으로 커집니다. `arc`의 각도는 라디안으로 적지만, 원을 그릴 때는 `0`부터 `Math.PI * 2`까지라고 기억하면 돼요.

### 3. 매 프레임, 위치를 바꾸고 다시 그려요

> **정의:** 애니메이션은 물체의 상태를 조금 바꾸고, 그 상태를 화면에 다시 그리는 일을 반복하는 거예요.
>
> `위치 갱신 → 화면 지우기 → 새 위치에 그리기 → 다음 프레임 예약`

Canvas는 그려진 공을 자동으로 옮겨 주지 않아요. 이전 그림을 지운 다음, 바뀐 좌표에 공을 다시 그려야 움직이는 것처럼 보입니다. 이 반복을 **애니메이션 루프**라고 불러요.

### 4. `requestAnimationFrame`은 다음 화면 갱신에 맞춰 실행을 예약해요

> **정의:** `requestAnimationFrame(함수)`는 브라우저가 다음 애니메이션 프레임을 그리기 직전에 함수를 실행해 달라고 예약해요.
>
> `requestAnimationFrame(animate);`

함수 안에서 다시 `requestAnimationFrame(animate)`를 부르면 다음 프레임도 예약되어 반복이 이어집니다. 브라우저 화면 갱신 흐름에 맞춰 실행되고, 보통 탭이 보이지 않을 때는 실행 빈도를 낮추거나 멈춰 자원을 아껴요.

`setInterval`은 정해 둔 시간 간격으로 함수를 반복 예약하는 도구예요. 화면이 그려지는 시점과 꼭 맞지는 않으므로, 화면 애니메이션에는 보통 `requestAnimationFrame`을 사용합니다. 화면이 60Hz라고 해서 모든 기기에서 코드가 정확히 초당 60번 실행된다고 보장되는 것은 아니에요.

## 함께 만들기: Canvas에 도형을 그려요

먼저 정지된 화면에 도형 여러 개를 그려 봅니다. `fillRect`는 사각형을 바로 그리고, 원은 `beginPath`와 `arc`로 경로를 만든 뒤 `fill`로 채워요.

```html playground title="Canvas 도구로 도형 그리기" height=360
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Canvas 도형</title>
  <style>
    body { margin: 0; padding: 16px; font-family: sans-serif; background: #f0f4f8; }
    canvas { display: block; max-width: 100%; height: auto; background: white; border: 2px solid #333; }
  </style>
</head>
<body>
  <canvas id="scene" width="560" height="280"></canvas>
  <script>
    const canvas = document.querySelector("#scene");
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#9fe870";
    ctx.fillRect(40, 40, 120, 80);

    ctx.beginPath();
    ctx.arc(260, 80, 40, 0, Math.PI * 2);
    ctx.fillStyle = "tomato";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(360, 120);
    ctx.lineTo(440, 40);
    ctx.lineTo(520, 120);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillStyle = "#222";
    ctx.fillText("그림판에 그렸어요!", 40, 190);
  </script>
</body>
</html>
```

### 실행하고 관찰하기

1. **▶ 실행**을 눌러 사각형, 원, 선, 글자를 확인하세요.
2. `fillRect(40, 40, 120, 80)`의 숫자 중 첫 두 값을 바꿔 도형 위치를 옮겨 보세요.
3. 원의 반지름 `40`을 `20`으로 바꾸면 크기가 어떻게 달라지나요?
4. `clearRect(0, 0, canvas.width, canvas.height)`를 마지막 그리기 명령 다음에 추가하면 무엇이 보이나요?

> 브라우저에서 실행 중인 코드를 바꿨다면 **▶ 실행**을 다시 눌러야 바뀐 결과를 볼 수 있어요. 내 컴퓨터에서는 VS Code에서 `index.html` 파일로 저장한 뒤 Live Server의 **Go Live**를 눌러 실행할 수도 있습니다.

## 함께 만들기: `requestAnimationFrame`으로 공 움직이기

이번에는 공의 x 좌표를 조금씩 바꾸고, 매 프레임 화면을 비운 뒤 새 위치에 그려요. 코드에서 `update()`는 공의 상태를 바꾸고 `draw()`는 화면에 그림을 그립니다.

```html playground title="공을 움직이는 애니메이션 루프" height=400
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>움직이는 공</title>
  <style>
    body { margin: 0; padding: 16px; font-family: sans-serif; background: #f0f4f8; }
    canvas { display: block; max-width: 100%; height: auto; background: white; border: 2px solid #333; }
  </style>
</head>
<body>
  <canvas id="scene" width="560" height="280"></canvas>
  <script>
    const canvas = document.querySelector("#scene");
    const ctx = canvas.getContext("2d");
    const ball = { x: 40, y: 140, radius: 22, speed: 2.5 };

    function update() {
      ball.x += ball.speed;
      if (ball.x - ball.radius > canvas.width) {
        ball.x = -ball.radius;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "tomato";
      ctx.fill();
      ctx.fillStyle = "#222";
      ctx.fillText("x: " + Math.round(ball.x), 16, 24);
    }

    function animate() {
      update();
      draw();
      requestAnimationFrame(animate);
    }

    animate();
  </script>
</body>
</html>
```

### 실행하고 관찰하기

1. **▶ 실행**을 누르고 공이 오른쪽으로 이동하다 다시 나타나는지 확인하세요.
2. `ball.x += ball.speed`를 찾아 보세요. 이 줄을 `draw()` 안에 넣으면 무엇이 달라질까요?
3. `speed`를 `1`과 `6`으로 바꿔 속도를 비교하세요.
4. `clearRect`를 잠시 지우면 공의 자취가 어떻게 남나요?
5. `requestAnimationFrame(animate)`를 지우면 어떤 프레임까지만 그려지나요?

공을 한 프레임 그리는 코드와 다음 프레임을 예약하는 코드가 서로 연결되어야 계속 움직입니다. 2주차에는 여기에 `y` 위치와 아래 방향 속도를 더해 공을 떨어뜨려 볼 거예요.

## 미션 A: 키보드로 공을 조종해요

화면 가운데 있는 공을 방향키로 움직여 보세요. 공이 캔버스 밖으로 완전히 사라지지 않도록 가장자리를 처리합니다. 아래 시작 코드의 `// ✏️ 작성해 보기` 부분을 채우세요.

- **해야 할 일:** 왼쪽·오른쪽·위·아래 방향키를 누르면 공이 해당 방향으로 이동하게 만드세요.
- **완료 조건:** 방향키 네 개가 모두 동작하고, 공의 중심이 캔버스 밖으로 나가지 않아요.
- **더 해보기:** `speed` 값을 바꾸어 조작 느낌을 비교하고, 공 색도 원하는 색으로 바꾸세요.

> 힌트 보기
>
> - `keydown` 이벤트에서 `event.key` 값을 확인하면 어떤 키를 눌렀는지 알 수 있어요.
> - 화면을 그리기 전에 x와 y가 각각 `radius`보다 작거나 `캔버스 크기 - radius`보다 큰지 확인해 보세요.
> - 위쪽으로 움직일 때 y는 커질까요, 작아질까요?

```html playground title="미션: 방향키로 공 조종하기" height=400
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>키보드 공 조종</title>
  <style>
    body { margin: 0; padding: 16px; font-family: sans-serif; background: #f0f4f8; }
    p { margin: 0 0 10px; }
    canvas { display: block; max-width: 100%; height: auto; background: white; border: 2px solid #333; }
  </style>
</head>
<body>
  <p>방향키를 눌러 공을 움직여 보세요.</p>
  <canvas id="scene" width="560" height="280"></canvas>
  <script>
    const canvas = document.querySelector("#scene");
    const ctx = canvas.getContext("2d");
    const ball = { x: 280, y: 140, radius: 22, speed: 12 };

    window.addEventListener("keydown", (event) => {
      // ✏️ event.key가 "ArrowRight"일 때 x를 바꿔 보세요.
      // ✏️ 나머지 세 방향키도 조건을 추가해 보세요.

      // 방향키를 눌렀을 때 페이지가 스크롤되지 않게 해요.
      if (event.key.startsWith("Arrow")) event.preventDefault();
    });

    function update() {
      // ✏️ x와 y가 캔버스 가장자리 밖으로 나가지 않도록 범위를 정해 보세요.
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#9fe870";
      ctx.fill();
      ctx.fillStyle = "#222";
      ctx.fillText("방향키로 움직여요", 16, 24);
    }

    function animate() {
      update();
      draw();
      requestAnimationFrame(animate);
    }
    animate();
  </script>
</body>
</html>
```

## 도전 미션: 공의 자취로 그림을 그려요

애니메이션 실습의 `draw()` 함수에서 `clearRect`를 잠시 꺼 보고 공의 자취가 남는지 관찰하세요. 공의 속도나 색을 바꿔 자취로 만들 그림을 정하고, 자취를 지우려면 어떤 코드를 다시 켜야 하는지 설명해 보세요.

- **완료 조건:** 공의 자취가 화면에 남고, `clearRect`가 자취를 없애는 이유를 자기 말로 설명해요.
- **더 해보기:** 공의 이동 속도나 색을 바꾸어 자취의 모양을 다르게 만들어 보세요.

## 오늘 배운 것 정리하기

- Canvas에서 원을 그릴 때 필요한 순서를 말해 보세요.
- 움직이는 그림을 만들려면 프레임마다 어떤 두 가지 일을 해야 하나요?
- `requestAnimationFrame`은 무엇을 예약하나요?
- 다음 시간에는 오늘의 애니메이션 루프에 중력과 바닥 충돌을 더해, 직접 만든 공을 튕기게 할 거예요.

## 교사용 메모 (학생에게는 숨김)

- **수업 시간:** 100분 (전반 50분, 쉬는 시간, 후반 50분)
- **수업 흐름 제안:** 전반 50분은 지난 시간 회상(5분), FPS·Canvas·rAF 개념 복습(10분), 도형 그리기(10분), 이동 애니메이션(20분), 쉬는 시간 전 설명(5분). 후반 50분은 미션(30분), 학생의 코드 설명과 수정(10분), 정리 및 다음 시간 연결(10분).
- **첨부 자료 반영 범위:** 브라우저 렌더링 단계, DOM과 Canvas의 차이, FPS·프레임, `setInterval`과 `requestAnimationFrame` 내용을 학생 눈높이로 압축했다. 원본의 성능 측정 실험, 프레임 예산 세부 수치, 장문의 렌더링 용어는 이번 실습 목표에 꼭 필요하지 않아 제외했다. Canvas가 항상 빠르다는 식으로 일반화하지 않는다.
- **예상되는 막힘:** `arc`는 원을 바로 화면에 그리는 명령이 아니라 경로를 준비한다. `fill()`까지 호출해야 채워진다. Canvas 원점은 왼쪽 위라 y가 커질수록 아래로 이동한다. `clearRect`를 빼먹으면 이전 프레임의 픽셀이 남는다.
- **미션 정답 예시:** 방향키 이벤트에서 `ArrowLeft`/`ArrowRight`면 x에서 빼거나 더하고, `ArrowUp`/`ArrowDown`이면 y에서 빼거나 더한다. `update()`에서 `ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x))`와 같은 범위 처리를 하고 y에도 적용한다. 학생이 직접 조건문으로 쓰는 방식도 정답으로 인정한다.
- **수업 환경:** 교안 코드 카드는 HTML/CSS/JavaScript를 포함한 완결된 한 파일이다. 개인 컴퓨터에서는 각 블록을 별도 `index.html`로 저장해 Live Server로 실행한다.
