# Code Review — 소비 기회비용 계산기

리뷰 기준일: 2026-05-27  
리뷰 범위: index.html · style.css · calculator.js · data.js  
기준 문서: PRD.md · .claude/skills/SKILL.md

---

## 심각도 분류 기준

| 등급 | 기준 |
|------|------|
| Critical | 런타임 오류 또는 성능에 직접적 악영향 |
| Warning | 버그 가능성 또는 PRD 명세 미충족 |
| Info | 코드 품질 개선 권고 (기능 영향 없음) |

---

## Critical

### C-01 | style.css:7 | 구글 폰트 이중 로드 | 직접수정

**문제**  
`style.css` 최상단 `@import url('https://fonts.googleapis.com/...')` 와 `index.html` `<head>`의 `<link rel="stylesheet">` 가 동일한 폰트를 두 번 요청한다.  
CSS `@import`는 브라우저 렌더링 블로킹 수준이 `<link>` 보다 높고, HTML에 이미 `preconnect` 힌트와 함께 올바르게 로드하고 있으므로 CSS `@import`는 불필요하며 페이지 렌더링 지연을 유발한다.

**Before (style.css line 7)**
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
```

**After**  
해당 줄 전체 제거. `index.html`의 `<link>` + `preconnect` 조합이 유일한 폰트 로드 경로로 유지됨.

---

## Warning

### W-01 | index.html:165 | historyEmpty 죽은 변수 | 직접수정

**문제**  
`const historyEmpty = document.getElementById('history-empty')` 로 DOM 참조를 선언했으나 이후 코드 어디서도 실제로 사용되지 않는다. `renderHistory()` 함수는 `historyList.innerHTML = ''` 로 컨테이너를 초기화하고 새로운 `<p>` 요소를 동적으로 생성하기 때문에, 초기 HTML에서 얻은 참조는 첫 번째 `renderHistory()` 호출 이후 stale 상태가 된다.

**Before**
```js
const historyList       = document.getElementById('history-list');
const historyEmpty      = document.getElementById('history-empty');
const clearHistoryBtn   = document.getElementById('clear-history-btn');
```

**After**
```js
const historyList       = document.getElementById('history-list');
const clearHistoryBtn   = document.getElementById('clear-history-btn');
```

---

### W-02 | index.html:328 | 공유 버튼 double-click race condition | 직접수정

**문제**  
`copyShareLink()` 함수 내부의 `.then()` 콜백에서 `const original = shareBtn.textContent` 를 캡처한다. 첫 번째 클릭이 비동기 처리 중일 때 두 번째 클릭이 발생하면, 두 번째 `.then()` 콜백 실행 시점에 `shareBtn.textContent` 가 이미 `'복사 완료!'` 로 변경된 상태다. 결과적으로 두 번째 타임아웃이 만료될 때 원래 레이블 대신 `'복사 완료!'` 가 영구적으로 표시된다. `fallbackCopy` 에도 동일한 패턴이 있었다.

**Before**
```js
navigator.clipboard.writeText(url.toString()).then(() => {
  const original = shareBtn.textContent;   // 비동기 콜백 내에서 늦게 캡처
  shareBtn.textContent = '복사 완료!';
  setTimeout(() => { shareBtn.textContent = original; }, 2000);
})
```

**After**  
`setShareBtnCopied()` 헬퍼 함수를 도입해, 함수 진입 시점(동기)에 `original` 을 캡처한 뒤 즉시 텍스트를 변경한다.

```js
function setShareBtnCopied() {
  const original = shareBtn.textContent;   // 동기 시점에 캡처
  shareBtn.textContent = '복사 완료!';
  setTimeout(() => { shareBtn.textContent = original; }, 2000);
}
```

---

### W-03 | style.css:501 | cannot-buy 카드 hover 시 accent glow 표시 | 직접수정

**문제**  
`.result-card:hover` 규칙이 모든 카드에 `border-color: var(--color-accent)` 와 `box-shadow: var(--shadow-glow)` 를 적용한다. "살 수 없어요" 카드(`opacity: 0.55`)에서도 hover 시 동일한 형광 라임 글로우가 발생해, 구매 불가 상태임에도 긍정적 인터랙션 피드백을 주는 시각적 불일치가 생긴다.

**Before**  
`cannot-buy` 카드 전용 hover 규칙 없음 — 부모 규칙이 그대로 상속됨.

**After**
```css
.result-card.cannot-buy:hover {
  transform: translateY(-2px);
  border-color: var(--color-border);
  box-shadow: var(--shadow-card);
}
```

---

### W-04 | PRD.md:79 | 파일 구조 명세와 실제 구현 불일치 | 권고

**문제**  
PRD 섹션 4 파일 구조에 `app.js` 가 명시되어 있으나, 실제 구현에서는 계산 로직이 `calculator.js` 에, DOM 조작 및 이벤트 핸들링이 `index.html` 인라인 모듈 스크립트에 분리되어 있다. `app.js` 파일은 존재하지 않는다. PRD 섹션 5의 `app.js` 역할 설명도 동일하게 불일치한다.

**권고**  
PRD를 현재 아키텍처(`calculator.js` + `index.html` 인라인 스크립트)에 맞게 업데이트한다. `CLAUDE.md` 는 이미 올바른 구조를 문서화하고 있다.

---

## Info

### I-01 | index.html:306 | button 요소에 role="listitem" 동적 할당 | 권고

**문제**  
`renderHistory()` 에서 `btn.setAttribute('role', 'listitem')` 으로 `<button>` 에 `listitem` 역할을 부여한다. ARIA 1.2 기준으로 허용되는 조합이나, 시맨틱 구조 측면에서는 `<ul role="list"><li><button>...</button></li></ul>` 패턴이 더 명확하다. 현재 부모 컨테이너는 `role="list"` 를 가진 `<div>` 이므로 스크린리더 지원에 실질적인 문제는 없다.

---

### I-02 | style.css:579 | .card-badge text-transform:uppercase 한국어에 무효 | 직접수정

**문제**  
뱃지 텍스트("살 수 있어요", "살 수 없어요")는 한국어로만 구성되어 있어 `text-transform: uppercase` 가 시각적 효과를 갖지 않는다. 불필요한 속성이다.

**Before**
```css
.card-badge {
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
```

**After**
```css
.card-badge {
  letter-spacing: 0.04em;
}
```

---

### I-03 | index.html:54 | amount input maxlength 미설정 | 직접수정

**문제**  
PRD는 0 이하 및 비숫자 입력 유효성 검사를 명세하지만, 입력 길이 상한은 지정하지 않는다. `maxlength` 없이 매우 긴 값을 입력하면 `toLocaleString` 이 과도한 자릿수 숫자를 생성해 레이아웃이 깨질 수 있다.

**After**  
`maxlength="13"` 추가 (콤마 포함 최대 9,999,999,999원 = 13자).

---

## 수정 요약

| # | 등급 | 파일 | 수정 내용 | 처리 |
|---|------|------|-----------|------|
| C-01 | Critical | style.css | 중복 폰트 `@import` 제거 | 직접수정 |
| W-01 | Warning | index.html | 미사용 `historyEmpty` 변수 제거 | 직접수정 |
| W-02 | Warning | index.html | share 버튼 race condition — `setShareBtnCopied` 헬퍼 도입 | 직접수정 |
| W-03 | Warning | style.css | `cannot-buy` 카드 hover 규칙 추가 (accent glow 억제) | 직접수정 |
| W-04 | Warning | PRD.md | `app.js` → 실제 파일명 불일치 | 권고 |
| I-01 | Info | index.html | button + role=listitem 시맨틱 개선 여지 | 권고 |
| I-02 | Info | style.css | `.card-badge` `text-transform:uppercase` 제거 | 직접수정 |
| I-03 | Info | index.html | `amount-input` `maxlength="13"` 추가 | 직접수정 |

---

## PRD 명세 충족 검토

| 기능 | 명세 | 상태 |
|------|------|------|
| F-01 금액 입력 + 콤마 포맷팅 | PRD 섹션 2 | 정상 |
| F-02 프리셋 버튼 4종 | PRD 섹션 2 | 정상 |
| F-03 기회비용 카드 6개 렌더링 | PRD 섹션 2 | 정상 |
| F-04 히스토리 최대 5개 태그 | PRD 섹션 3 | 정상 |
| F-05 히스토리 초기화 | PRD 섹션 2 | 정상 |
| F-06 공유 링크 (URL 파라미터 + 클립보드) | PRD 섹션 2 | race condition 수정 후 정상 |
| F-07 staggered 애니메이션 + 카운트업 | PRD 섹션 2 | 정상 |
| F-08 반응형 375/768/1024/1440px | PRD 섹션 8 | 정상 |
| localStorage 구조 (amount + timestamp) | PRD 섹션 3 | 정상 |
| 동일 금액 재입력 시 timestamp 갱신 | PRD 섹션 3 | 정상 |
| URL ?amount= 자동 계산 | PRD 섹션 3 | 정상 |
| 0 이하 / 비숫자 입력 차단 | PRD 섹션 8 | 정상 |
| 색상 토큰 CSS 변수 | PRD 섹션 6 | 정상 |
| Space Grotesk + Noto Sans KR | PRD 섹션 6 | 중복 로드 수정 후 정상 |
| gradient mesh + noise texture 배경 | PRD 섹션 6 | 정상 |
| prefers-reduced-motion | 명세 외 추가 구현 | 정상 |
