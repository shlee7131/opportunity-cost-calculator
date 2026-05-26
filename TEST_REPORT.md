# 통합 테스트 결과

**테스트 일시:** 2026-05-27
**테스트 방식:** 정적 코드 분석
**테스트 파일:** index.html / data.js / calculator.js / style.css
**테스터:** integration-tester 에이전트

---

## 테스트 요약

| 항목 | 결과 |
|------|------|
| 전체 시나리오 | 12개 (세부 항목 포함 15개) |
| PASS | 15개 |
| FAIL | 0개 |
| FIXED | 0개 |

---

## 시나리오별 상세 결과

### S-01. 정상 입력: 5000원
**판정:** PASS

**검증 근거:**

`calculate(5000, ITEMS)` 호출 경로:

- `calculator.js:17` — `Array.isArray(dataArray)` 검사 통과 (ITEMS는 배열)
- `calculator.js:22` — `amount === ""` 검사 통과 (5000은 빈 문자열 아님)
- `calculator.js:26` — `const num = Number(5000)` = 5000
- `calculator.js:28` — `isNaN(5000)` = false → 통과
- `calculator.js:32` — `5000 <= 0` = false → 통과
- `calculator.js:36~46` — `dataArray.map()` 실행

starbucks 계산 검증:
- `calculator.js:37` — `raw = 5000 / 4500` = 1.1111...
- `calculator.js:38` — `quantity = parseFloat((1.1111).toFixed(2))` = **1.11**
- `calculator.js:39` — `canBuy = 1.11 >= 0.1` = **true** ✓

카드 렌더링 경로:
- `index.html:209` — `const results = calculate(amount, ITEMS)` 결과 배열 수신
- `index.html:217` — `renderCards(results)` 호출
- `index.html:174` — `results.forEach((item, index) => { ... })` 로 각 카드 생성
- `index.html:177` — `article.className = 'result-card' + (item.canBuy ? '' : ' cannot-buy')`
- `index.html:183` — `qtyDisplay = item.quantity.toLocaleString(...)` = "1.11"
- `index.html:198` — `resultGrid.appendChild(article)` 로 DOM 삽입

---

### S-02. 정상 입력: 1,000,000원
**판정:** PASS

**검증 근거:**

samsung 계산 검증:
- `calculator.js:37` — `raw = 1000000 / 57000` = 17.5438...
- `calculator.js:38` — `quantity = parseFloat((17.5438).toFixed(2))` = **17.54** ✓

apple 계산 검증:
- `calculator.js:37` — `raw = 1000000 / 280000` = 3.5714...
- `calculator.js:38` — `quantity = parseFloat((3.5714).toFixed(2))` = **3.57** ✓

큰 숫자 포매팅:
- `index.html:136~138` — `formatNumber(value)` = `Number(value).toLocaleString('ko-KR')`
- 1000000 → "1,000,000" 으로 쉼표 포매팅 ✓
- `index.html:215` — `resultAmountDisp.textContent = formatNumber(amount) + '원'` = "1,000,000원" ✓

---

### S-03. 예외 입력: 0
**판정:** PASS

**검증 근거:**

- `calculator.js:26` — `const num = Number(0)` = 0
- `calculator.js:32` — `0 <= 0` = **true** → `throw new Error("0보다 큰 금액을 입력해주세요.")` ✓
- `index.html:226` — `catch (err) { showError(err.message); }` 실행
- `index.html:158~161` — `showError()`: `errorMsg.textContent = message`, `errorMsg.removeAttribute('hidden')` 실행
- `index.html:65` — `<p class="error-message" id="error-msg" role="alert" hidden>` — `hidden` 제거 후 메시지 표시 ✓

---

### S-04. 예외 입력: -1000
**판정:** PASS

**검증 근거:**

- `calculator.js:26` — `const num = Number(-1000)` = -1000
- `calculator.js:32` — `-1000 <= 0` = **true** → 음수도 동일 조건식에 포함됨
- `throw new Error("0보다 큰 금액을 입력해주세요.")` ✓

`num <= 0` 조건은 `num === 0` 과 `num < 0` 모두를 포괄하므로 음수 예외 처리 정상 동작.

---

### S-05. 예외 입력: "abc"
**판정:** PASS

**검증 근거:**

- `calculator.js:22` — `"abc" === ""` = false → 통과
- `calculator.js:26` — `const num = Number("abc")` = **NaN**
- `calculator.js:28` — `isNaN(NaN)` = **true** → `throw new Error("올바른 숫자를 입력해주세요.")` ✓
- `index.html:226` — `catch` → `showError("올바른 숫자를 입력해주세요.")` ✓

index.html에서 `amountInput.value = "abc"` 후 `calculateBtn.click()`:
- `index.html:315` — `const amount = amountInput.value` = "abc" (string)
- `index.html:316` — `runCalculation("abc")` 호출 → 위 경로대로 에러 표시 ✓

---

### S-06. 예외 입력: 빈 값
**판정:** PASS

**검증 근거:**

- `calculator.js:22` — `"" === ""` = **true** → `throw new Error("금액을 입력해주세요.")` ✓
- `index.html:315` — `const amount = amountInput.value` = "" (빈 문자열)
- `index.html:316` — `runCalculation("")` 호출
- `index.html:226` — `catch` → `showError("금액을 입력해주세요.")` ✓
- `index.html:65` — `#error-msg` 요소에 메시지 표시 ✓

---

### S-07. localStorage 저장
**판정:** PASS

**검증 근거:**

saveHistory(5000) 호출 경로:
- `calculator.js:57` — `const history = loadHistory()` 로 기존 히스토리 로드
- `calculator.js:58` — `const now = new Date().toISOString()` — ISO8601 형식 timestamp 생성 ✓
- `calculator.js:62` — `const filtered = history.filter((entry) => entry.amount !== num)` — 중복 제거
- `calculator.js:65` — `filtered.unshift({ amount: num, timestamp: now })` — 구조: `{ amount: 5000, timestamp: "2026-..." }` ✓
- `calculator.js:68` — `filtered.slice(0, 5)` — 최대 5개 유지 ✓
- `calculator.js:70` — `localStorage.setItem("occ_history", JSON.stringify(trimmed))` ✓

성공 시 saveHistory 호출:
- `index.html:218` — `saveHistory(amount)` — `calculate()` 성공 후, 결과 렌더링 직후 호출 ✓

---

### S-08. localStorage 새로고침 후 복원
**판정:** PASS

**검증 근거:**

페이지 초기화 시 히스토리 로드:
- `index.html:357` — `renderHistory()` 호출 (스크립트 최하단, DOMContentLoaded 상당)
- `index.html:235` — `renderHistory()` 내부: `const history = loadHistory()` 호출
- `calculator.js:83` — `const raw = localStorage.getItem("occ_history")` ✓
- `calculator.js:84` — `if (!raw) return []` — 키 없을 때 빈 배열 반환 ✓

파싱 실패 방어 코드:
- `calculator.js:86` — `const parsed = JSON.parse(raw)` — 실패 시 catch로 이동
- `calculator.js:87` — `if (!Array.isArray(parsed)) return []` — 비정상 데이터 방어 ✓
- `calculator.js:93~95` — `catch (e) { return []; }` — 파싱 예외 방어 ✓

URL ?amount= 처리 후 saveHistory:
- `index.html:360~368` — URL 파라미터 파싱 후 `runCalculation(parsed)` 호출
- `index.html:218` — `runCalculation` 성공 시 `saveHistory(amount)` 자동 호출 ✓

---

### S-09. localStorage 초기화
**판정:** PASS

**검증 근거:**

- `index.html:336~339` — `clearHistoryBtn.addEventListener('click', () => { clearHistory(); renderHistory(); })`
- `calculator.js:103` — `localStorage.removeItem("occ_history")` ✓
- `calculator.js:99~107` — try/catch 방어 코드 포함 ✓
- `index.html:339` — `renderHistory()` 재호출
- `index.html:240~247` — `history.length === 0` → `'최근 계산 내역이 없습니다'` 텍스트 `<p>` 생성 후 `historyList.appendChild(p)` ✓

---

### S-10. UI 카드 그리드 배치
**판정:** PASS

**검증 근거:**

- `style.css:443` — `.result-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }` ✓
- `auto-fill` 키워드 사용 ✓
- `minmax(260px, 1fr)` 가변 컬럼 ✓
- `index.html:101` — `<div class="result-grid" id="result-grid" hidden>` — `result-grid` 클래스 적용된 DOM 요소 존재 ✓

---

### S-11. 모바일 뷰(375px) 레이아웃
**판정:** PASS

**검증 근거:**

미디어 쿼리 존재:
- `style.css:768` — `@media (max-width: 767px)` — 375px 포함 ✓

결과 그리드 1열:
- `style.css:784~786` — `.result-grid { grid-template-columns: 1fr; }` ✓

입력 섹션 grid 변화:
- `style.css:769~772` — `.input-section .page-wrapper { grid-template-columns: 1fr; gap: 32px; }` (데스크톱 `1fr auto` → 모바일 `1fr`) ✓

히스토리 가로 스크롤:
- `style.css:661~668` — `.history-list { display: flex; gap: 8px; overflow-x: auto; ... }` — 미디어 쿼리 밖 전역 선언, 모바일에서도 적용 ✓

---

### S-12a. 타이포그래피 원칙
**판정:** PASS

**검증 근거:**

generic 폰트 미사용:
- `style.css:34` — `--font-display: 'Space Grotesk', sans-serif;` — Arial/Inter/Roboto 미사용 ✓
- `style.css:35` — `--font-body: 'Noto Sans KR', sans-serif;` — generic 폰트 미사용 ✓
- `index.html:12` — Google Fonts에서 Space Grotesk + Noto Sans KR 로드 ✓

display 폰트 + body 폰트 조합:
- display: Space Grotesk (개성 있는 기하학 산세리프) ✓
- body: Noto Sans KR (한글 본문 가독성) ✓

CSS 변수 정의:
- `style.css:34` — `--font-display` 정의 ✓
- `style.css:35` — `--font-body` 정의 ✓

---

### S-12b. 색상/테마 원칙
**판정:** PASS

**검증 근거:**

CSS 변수로 색상 체계 구성:
- `style.css:13~19` — `--color-bg`, `--color-surface`, `--color-border`, `--color-accent`, `--color-accent-2`, `--color-text`, `--color-muted` 7개 핵심 토큰 ✓
- `style.css:21~26` — Extended 토큰 (`--color-surface-2`, `--color-accent-dim`, `--color-accent-glow`, `--color-accent2-dim`) ✓

진부한 보라색 그라디언트 미사용:
- Grep 검색 결과 `purple`, `violet` 키워드 없음 ✓
- 그라디언트는 `radial-gradient(ellipse at 15% 50%, rgba(26, 56, 30, 0.55)...` — 다크 그린 계열 ✓

강한 포인트 컬러:
- `style.css:16` — `--color-accent: #C6F135` (형광 라임) ✓
- `style.css:17` — `--color-accent-2: #FF4D1C` (번트 오렌지) ✓

---

### S-12c. 애니메이션/인터랙션 원칙
**판정:** PASS

**검증 근거:**

CSS-only @keyframes 애니메이션:
- `style.css:723~731` — `@keyframes fadeUp` — `opacity: 0 + translateY(24px)` → `opacity: 1 + translateY(0)` ✓
- `style.css:734~737` — `@keyframes fadeIn` ✓
- `style.css:739~747` — `@keyframes slideDown` ✓

페이지 로드 staggered reveal:
- `style.css:751~753` — `.site-header { animation: slideDown 0.5s 0.05s both; }` ✓
- `style.css:755~757` — `.input-section { animation: fadeUp 0.5s 0.15s both; }` ✓
- `style.css:759~761` — `.history-section { animation: fadeUp 0.5s 0.25s both; }` — 헤더 → 입력부 → 히스토리 순서 ✓

카드 staggered reveal:
- `style.css:600~607` — `.result-card:nth-child(1~8)` 각 0.06s 간격 딜레이 ✓

hover 인터랙션:
- `style.css:488~492` — `.result-card:hover { transform: translateY(-6px); border-color: var(--color-accent); box-shadow: var(--shadow-glow); }` ✓
- `style.css:308~312` — `.preset-btn:hover { background: var(--color-accent); transform: rotate(2deg) scale(1.04); }` ✓
- `style.css:331~334` — `.calculate-btn:hover { transform: translateY(-2px); box-shadow: ... }` ✓

---

### S-12d. 금지 요소 부재 확인
**판정:** PASS

**검증 근거:**

generic 폰트 없음:
- style.css 전체에서 'Arial', 'Inter', 'Roboto' 키워드 없음 ✓

예측 가능한 단순 레이아웃 패턴 없음:
- `style.css:206~210` — 입력 섹션: `grid-template-columns: 1fr auto` — 비대칭 2열 구성 ✓
- `style.css:159~167` — `.header-accent-line { transform: skewX(-20deg); }` — 대각선 장식 요소 ✓
- `style.css:471~484` — `.result-card::after { transform: rotate(12deg) translateY(-10%); }` — 기울어진 내부 장식선 ✓

보라색 그라디언트 없음:
- Grep 검색: 'purple', 'violet' 키워드 0건 ✓
- 배경: `radial-gradient(ellipse at 15% 50%, rgba(26, 56, 30, 0.55)...)` — 녹색 계열 ✓
- SVG noise texture: `style.css:78` — `feTurbulence` 필터 기반 noise overlay (opacity 0.035) ✓

---

## 수정 완료 사항

없음 — 전체 시나리오 PASS 판정으로 코드 수정 불필요.

---

## 미해결 항목

없음.

---

## 참고: 코드 품질 관찰 사항 (FAIL 아님)

1. **data.js 아이템 수**: PRD 섹션 7에서는 7개 카테고리를 명시하나, data.js에는 `latte`(카페라테) 항목이 추가되어 총 **8개** 아이템이 존재. index.html:85에서 하드코딩된 `<span class="input-side-value">8</span>`과 일치하므로 정상 동작.

2. **formatNumber 위치**: `formatNumber()` 함수가 index.html 내 `<script type="module">` 블록에 인라인으로 정의됨(index.html:136~138). calculator.js에는 없으나 PRD의 app.js 역할을 index.html 인라인 스크립트가 대체하는 구조로, 기능상 문제 없음.
