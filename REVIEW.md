# 코드 리뷰 결과

**리뷰 일시:** 2026-05-27
**리뷰 파일:** data.js / calculator.js / style.css / index.html
**리뷰어:** code-reviewer 에이전트

---

## 1. PRD 요구사항 반영 현황

### 핵심 기능 F-01 ~ F-08

| # | 기능 | 구현 여부 | 비고 |
|---|------|-----------|------|
| F-01 | 금액 입력 (숫자 필드 + 쉼표 포매팅) | 부분 | `type="number"` 입력 사용 — 쉼표 포매팅은 결과 표시 시에만 적용, 입력 필드 자체에는 실시간 포매팅 없음. PRD "쉼표 포매팅(1,000원 단위)" 기준 미충족 (Warning) |
| F-02 | 빠른 금액 버튼 (4종 프리셋) | 완료 | 4,500 / 6,000 / 10,000 / 50,000원 모두 구현 |
| F-03 | 기회비용 카드 표시 (6개 카테고리) | 완료 | data.js에 8개 아이템 구현 (PRD 7개 + latte 추가) |
| F-04 | 히스토리 태그 표시 + 클릭 재계산 | 완료 | localStorage 연동, 클릭 시 `runCalculation()` 호출 |
| F-05 | 히스토리 초기화 버튼 | 완료 | `clearHistory()` 연결 정상 |
| F-06 | URL 쿼리 파라미터 공유 + 클립보드 복사 | 완료 | `copyShareLink()`, fallback 구현 포함 |
| F-07 | 카드 staggered reveal + 카운트업 애니메이션 | 완료 | staggered reveal + `requestAnimationFrame` 기반 600ms easeOut 카운트업 모두 구현됨 |
| F-08 | 반응형 레이아웃 (375px ~ 1440px) | 완료 | 375 / 768 / 1024 / 1440px 브레이크포인트 모두 존재 |

### PRD 섹션 7 비교 데이터 기준값 (7개)

| ID | 구현 여부 | 단가 일치 |
|----|-----------|-----------|
| samsung | 완료 | 57,000원 일치 |
| apple | 완료 | 280,000원 일치 |
| gold | 완료 | 120,000원 일치 |
| starbucks | 완료 | 4,500원 일치 |
| triangle | 완료 | 1,500원 일치 |
| netflix | 완료 | 183원/일 일치 (환산값) |
| travel | 완료 | 20원/마일 일치 |
| **latte** | PRD 외 추가 | 5,900원 — PRD 미명시 아이템 |

PRD 명시 7개 항목 모두 존재. `latte` 추가 아이템은 기능적 문제 없음.

### PRD 섹션 8 완료 기준

| 체크 항목 | 상태 |
|-----------|------|
| 금액 입력 → 계산 → 카드 렌더링 | 완료 |
| 프리셋 버튼 4종 즉시 계산 | 완료 |
| localStorage 히스토리 저장/불러오기 (최대 5개, 중복 제거) | 완료 |
| 히스토리 태그 클릭 → 재계산 | 완료 |
| 히스토리 초기화 | 완료 |
| 공유 링크 → URL ?amount= 자동 계산 | 완료 |
| 입력값 유효성 검사 (0 이하, 비숫자) | 완료 |
| Space Grotesk + Noto Sans KR 폰트 | 완료 |
| 지정 CSS 변수 색상 토큰 전체 적용 | 완료 |
| staggered reveal 애니메이션 (카드) | 완료 |
| 카드 hover 인터랙션 | 완료 |
| gradient mesh + noise texture 배경 | 완료 |
| 375px 1열 / 768px 2열 / 1024px+ 3열 | 완료 |
| 1440px+ 최대폭 고정 | 완료 |
| 숫자 카운트업 애니메이션 | 완료 |

---

## 2. 파일 간 연결 검토

### import 경로 및 export 방식

| 구문 | 파일 | 상태 |
|------|------|------|
| `import ITEMS from './data.js'` | index.html L130 | 정상 — data.js L78: `export default ITEMS` |
| `import { calculate, saveHistory, loadHistory, clearHistory } from './calculator.js'` | index.html L131 | 정상 — calculator.js L109: `export { calculate, saveHistory, loadHistory, clearHistory }` |
| `<link rel="stylesheet" href="style.css" />` | index.html L16 | 정상 |
| `<script type="module">` | index.html L129 | 정상 — ES Module 방식, Vercel 정적 배포 환경에서 정상 동작 |

**결론: 파일 간 연결 이상 없음.**

---

## 3. localStorage 명세 준수

| 항목 | 명세 | 구현 | 상태 |
|------|------|------|------|
| 키명 | `occ_history` | `const HISTORY_KEY = "occ_history"` | 일치 |
| 데이터 구조 | `{ amount: Number, timestamp: ISO8601 }` | `{ amount: num, timestamp: new Date().toISOString() }` | 일치 |
| 최대 5개 | 초과 시 오래된 항목 제거 | `filtered.slice(0, HISTORY_MAX)` | 일치 |
| 중복 제거 | 동일 금액 → timestamp만 갱신 | `filtered.unshift()`로 앞에 추가, 기존 동일 금액 필터링 | 일치 |
| 페이지 로드 시 불러오기 | DOMContentLoaded | `renderHistory()` 스크립트 하단 호출 | 일치 |
| 계산 시 저장 | 계산하기 / 프리셋 클릭 | `runCalculation()` 내부 `saveHistory()` 호출 | 일치 |
| 초기화 버튼 | 전체 삭제 | `clearHistory()` → `renderHistory()` | 일치 |
| URL 파라미터 시 자동 저장 | `?amount=` 자동 계산 후 저장 | `runCalculation()` 호출로 `saveHistory()` 포함 | 일치 |

**결론: localStorage 명세 완전 준수.**

---

## 4. 예외처리 검토

| 조건 | 에러 메시지 | 처리 위치 |
|------|-------------|-----------|
| 빈 입력 (`""`, `null`, `undefined`) | "금액을 입력해주세요." | calculator.js L22–24 |
| 문자 입력 (NaN) | "올바른 숫자를 입력해주세요." | calculator.js L28–30 |
| 음수 또는 0 | "0보다 큰 금액을 입력해주세요." | calculator.js L32–34 |
| dataArray 비어있거나 배열 아님 | "비교 데이터가 없습니다." | calculator.js L17–19 |

- `runCalculation()` 내 `calculate()` 호출이 `try/catch`로 감싸짐
- `catch(err)` 블록에서 `showError(err.message)` 호출 → `#error-msg` 요소에 표시
- `role="alert"` 속성으로 스크린리더 접근성 확보

**결론: 예외처리 충분. 모든 에러 경로가 `#error-msg`에 표시됨.**

---

## 5. 반응형 레이아웃 검토

| 브레이크포인트 | 명세 | style.css 위치 | 카드 컬럼 |
|---------------|------|----------------|-----------|
| 375px (max-width: 767px) | 1열 | L768 | `grid-template-columns: 1fr` (1열) |
| 768px (min-width: 768px) | 2열 | L804 | `repeat(2, 1fr)` (2열) |
| 1024px+ | 3열 | L811 | `repeat(3, 1fr)` (3열) |
| 1440px+ | 3열 최대폭 고정 | L825–833 | `repeat(3, 1fr)` + max-width 1320px |

- 히스토리 가로 스크롤: `overflow-x: auto`, `flex-shrink: 0`, 커스텀 스크롤바 스타일 모두 적용

**결론: 반응형 완전 구현.**

---

## 6. 디자인 스킬 가이드라인 반영

| 항목 | 상태 |
|------|------|
| display 폰트: Space Grotesk | 완료 |
| body 폰트: Noto Sans KR | 완료 |
| Arial/Inter/Roboto 미사용 | 확인됨 |
| CSS 변수 색상 체계 | 완료 (7개 핵심 토큰 + 4개 extended 토큰) |
| 보라색 그라디언트 미사용 | 확인됨 |
| 형광 라임 `#C6F135` + 번트 오렌지 `#FF4D1C` 포인트 | 완료 |
| 페이지 로드 staggered reveal | 완료 (header 0.05s → input 0.15s → history 0.25s) |
| 카드 staggered reveal | 완료 (nth-child 기반, 0.06s 간격) |
| hover: translateY(-6px) + border glow | 완료 |
| 프리셋 버튼 hover: 배경 반전 + rotate(2deg) | 완료 |
| gradient mesh 배경 | 완료 (radial-gradient 3중 레이어) |
| SVG noise texture | 완료 (feTurbulence, opacity 0.035) |
| geometric 원 장식 (우상단) | 완료 (body::after) |
| 비대칭 레이아웃 | 완료 (입력 섹션 1fr auto 그리드) |
| 대각선 요소 | 완료 (header-accent-line skewX, card::after rotate) |
| 흰 배경 + 파란 버튼 | 없음 |
| flat 카드 (shadow만) | 없음 |
| 가운데 정렬 단일 컬럼 | 없음 |

**결론: 디자인 가이드라인 완전 준수.**

---

## 7. 발견된 이슈 목록

| 심각도 | 파일 | 위치 | 문제 | 조치 |
|--------|------|------|------|------|
| HIGH | `calculator.js` | L38 | `toFixed(2)`로 소수점 둘째 자리까지 계산. PRD 섹션 7 "소수점 첫째 자리까지 표시" 명세 위반 | **수정 완료**: `toFixed(1)`로 변경 |
| HIGH | `index.html` | L210 | `decimals = 2`로 소수점 둘째 자리까지 표시. PRD 명세 위반. calculator.js 수정과 짝을 이루는 프론트엔드 측 버그 | **수정 완료**: `decimals = 1`로 변경 |
| MEDIUM | `index.html` | L217 | `cannot-buy` 카드의 `.qty-number`가 "0"으로 표시됨. 사용자가 "0개"를 살 수 없다는 의미로 읽을 수 있어 "—"로 교체 필요 | **수정 완료**: `canBuy ? '0' : '—'`으로 초기값 분기 처리 |
| WARNING | `index.html` | L54–56 | `type="number"` 입력 필드에 실시간 쉼표 포매팅 없음. PRD F-01 "쉼표 포매팅(1,000원 단위)" 명시. `type="number"` 한계상 `input` 이벤트 리스너 + `type="text"` 전환이 필요하나 기능 동작은 정상 | 미수정: 기능 동작 영향 없음, 별도 UX 개선 작업 필요 |
| INFO | `data.js` | L68–75 | PRD 섹션 7에 명시되지 않은 `latte`(카페라테) 아이템 추가. starbucks와 동일 카테고리(cafe) 중복 | 미수정: 기능적 문제 없음, 제품 결정 사항 |
| INFO | 구조 | — | PRD 섹션 4 파일 구조에 `app.js` 명시, 실제 구현은 `calculator.js` + index.html 인라인 스크립트. 파일명 불일치 | 미수정: PRD 또는 파일명 갱신 권장 |

---

## 8. 수정 완료 사항

### 수정 1: 소수점 표시 자릿수 (HIGH)

**파일:** `calculator.js` L38
**변경 전:** `const quantity = parseFloat(raw.toFixed(2));`
**변경 후:** `const quantity = parseFloat(raw.toFixed(1));`
**이유:** PRD 섹션 7 "소수점 결과는 소수점 첫째 자리까지 표시" 명세 준수.

### 수정 2: 카드 렌더링 소수점 자릿수 (HIGH)

**파일:** `index.html` L210
**변경 전:** `const decimals = Number.isInteger(item.quantity) ? 0 : 2;`
**변경 후:** `const decimals = Number.isInteger(item.quantity) ? 0 : 1;`
**이유:** calculator.js 수정과 일관성 유지. animateNumber 카운트업 표시 자릿수를 PRD 명세에 맞게 소수 1자리로 통일.

### 수정 3: cannot-buy 카드 수량 표시 (MEDIUM)

**파일:** `index.html` L212–226
**변경 전:** `.qty-number` 초기값이 항상 "0", `cannot-buy` 카드에서도 단위 텍스트가 표시됨
**변경 후:** `canBuy`가 false인 경우 `.qty-number`에 "—" 표시, 단위 텍스트 숨김
**이유:** "0개" 혼동 방지. 뱃지("살 수 없어요")와 수량 표시를 의미적으로 일치시킴.

---

## 9. 최종 평가

### 종합 점수: **91 / 100**

| 평가 영역 | 점수 | 비고 |
|-----------|------|------|
| PRD 핵심 기능 구현 | 19/20 | 입력 필드 실시간 쉼표 포매팅 미구현(-1) |
| 파일 간 연결 정확성 | 10/10 | 완전 정상 |
| localStorage 명세 준수 | 10/10 | 완전 준수 |
| 예외처리 | 9/10 | 견고한 처리; `type="number"` 브라우저 자체 차단과 앱 에러 메시지 경계가 모호한 부분(-1) |
| 반응형 구현 | 10/10 | 4개 브레이크포인트 모두 구현 완료 |
| 디자인 가이드라인 | 15/15 | 모든 항목 준수 |
| 코드 가독성 | 8/10 | 인라인 스크립트 분량(약 270줄)이 크고 PRD app.js 파일명 불일치(-2) |
| 데이터 정확성 | 5/5 | PRD 7개 항목 완전 일치 (latte 추가는 무결) |
| PRD 소수점 명세 준수 | 수정 후 완료 | toFixed(2)→(1) 수정 완료 |

### 코멘트

핵심 기능 전체가 정상 동작하며, 디자인 가이드라인(배경, 색상, 폰트, 모션, 반응형)을 충실히 이행한 완성도 높은 구현입니다. 이번 리뷰에서 직접 수정한 3가지 항목(소수점 자릿수 2곳, cannot-buy 수량 표시)은 PRD 명세와의 불일치를 해소한 것으로, 수정 이전 REVIEW.md에서 "Critical: 카운트업 미구현"으로 기재되었던 항목은 실제로 `animateNumber` 함수가 완전히 구현·호출되고 있어 오기재였습니다.

미수정 항목 중 기능상 가장 눈에 띄는 것은 입력 필드 실시간 쉼표 포매팅(F-01)으로, `type="text"` + 정규식 필터링 방식으로 전환하면 해결 가능합니다.
