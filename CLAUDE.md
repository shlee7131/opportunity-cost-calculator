# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

소비 기회비용 계산기. 금액을 입력하면 21개 비교 아이템 풀에서 랜덤 6개를 카드로 시각화한다.
배포 URL: https://opportunity-cost-calculator-dusky.vercel.app

## 로컬 실행

빌드 도구 없음. ES Module 사용으로 `file://` 직접 열기 불가 — HTTP 서버 필요.

```bash
npx serve .          # http://localhost:3000
npx http-server . -p 8080
```

## 배포

```bash
vercel --prod --yes   # Vercel CLI로 프로덕션 배포
git push origin master  # GitHub 연동 시 자동 배포 (현재 수동 배포 중)
```

## 아키텍처

모든 로직은 3개 파일로 분리되고 `index.html` 인라인 `<script type="module">`에서 조합된다.

```
data.js          → ITEMS 배열 (21종, 가격·단위·이모지·카테고리)
calculator.js    → calculate(), saveHistory(), loadHistory(), clearHistory()
index.html       → UI + 인라인 모듈 스크립트 (두 모듈 import)
style.css        → 전체 스타일 (CSS Custom Properties 기반 다크 테마)
```

### 핵심 데이터 흐름

1. `shuffledItems()` — `ITEMS`를 Fisher-Yates 셔플 후 `DISPLAY_COUNT`(6)개 슬라이스
2. `calculate(amount, items)` — 각 아이템에 대해 `quantity = amount / price` (소수점 1자리)
3. `canBuy = quantity >= 0.1` — 이 값으로 카드 뱃지와 카운트업 애니메이션 분기
4. `saveHistory(amount)` — `localStorage['occ_history']`에 최대 5건 유지

### 입력 처리 주의사항

`amount-input`은 `type="text"`(콤마 포맷팅 때문). 실제 숫자 추출은 항상 `getRawAmount()`를 경유해야 한다.

```js
function getRawAmount() {
  return amountInput.value.replace(/,/g, '');
}
```

### 가격 데이터 업데이트

`data.js` 상단의 기준일 주석과 각 `item.price`, `item.description`을 수정한다.
변동성 높은 항목(주식·금·환율·유가)은 `price-updater` 에이전트를 사용한다.

## 에이전트 구성

| 에이전트 | 담당 파일 |
|----------|-----------|
| `frontend-developer` | `index.html`, `style.css` |
| `backend-developer` | `data.js`, `calculator.js` |
| `code-reviewer` | 전체 |
| `integration-tester` | 정적 분석 기반 검증 → `TEST_REPORT.md` |
| `price-updater` | `data.js` 가격 최신화 |

`frontend-developer`는 작업 전 `/SKILL` 스킬을 호출해야 한다.

## 스킬

`.claude/skills/SKILL.md` (`/SKILL`) — 타이포그래피·색상·모션·레이아웃 가이드라인.
`frontend-developer` 에이전트 작업 시 호출, `code-reviewer` 에이전트도 디자인 기준 적용 시 참조.
