# PRD: 오늘 커피값으로 뭘 살 수 있었을까?
## 소비 기회비용 계산기

---

## 1. 프로젝트 개요

### 배경
매일 습관처럼 소비하는 금액이 다른 방식으로 쓰였다면 어떤 가치를 가졌을지를 직관적으로 보여주는 웹 도구. 커피 한 잔, 배달 음식 한 번처럼 작아 보이는 소비의 기회비용을 카드 형태로 시각화해 소비에 대한 새로운 관점을 제공한다.

### 목표
- 사용자가 금액을 입력하면 그 돈으로 살 수 있는 것들을 즉시 카드 형태로 표시
- 비교 대상은 주식·원자재·생활비·구독·여행 포인트 등 6개 카테고리
- 최근 입력 히스토리를 localStorage에 저장해 재방문 시 빠른 재계산 지원
- 순수 HTML/CSS/JS로 구현, Vercel 정적 배포

### 대상 사용자
소비 습관을 돌아보고 싶은 20~40대 직장인 및 학생

---

## 2. 핵심 기능 목록

| # | 기능 | 설명 |
|---|------|------|
| F-01 | 금액 입력 | 숫자 입력 필드 + 쉼표 포매팅(1,000원 단위) |
| F-02 | 빠른 금액 버튼 | 4,500원 / 6,000원 / 10,000원 / 50,000원 프리셋 버튼 |
| F-03 | 기회비용 카드 표시 | 6개 카테고리 별 "몇 개/주/회" 계산 결과를 카드로 렌더링 |
| F-04 | 히스토리 표시 | 최근 5개 입력 금액을 하단에 태그 형태로 표시, 클릭 시 재계산 |
| F-05 | 히스토리 초기화 | 히스토리 전체 삭제 버튼 |
| F-06 | 결과 공유 | URL 쿼리 파라미터(?amount=4500)로 결과 공유 링크 생성 + 클립보드 복사 |
| F-07 | 애니메이션 | 카드 staggered reveal, 숫자 카운트업 애니메이션 |
| F-08 | 반응형 레이아웃 | 모바일(375px) ~ 데스크톱(1440px) 대응 |

---

## 3. 로컬스토리지 활용 명세

### 저장 키

| 키 | 타입 | 설명 |
|----|------|------|
| `occ_history` | JSON Array | 최근 입력 금액 히스토리 |

### 데이터 구조

```json
// occ_history
[
  {
    "amount": 4500,
    "timestamp": "2026-05-26T14:30:00.000Z"
  },
  {
    "amount": 15000,
    "timestamp": "2026-05-25T09:12:00.000Z"
  }
]
```

- 최대 5개 항목 유지 (초과 시 가장 오래된 항목 제거)
- 동일 금액 재입력 시 timestamp만 갱신 (중복 추가 안 함)

### 저장 시점
- 사용자가 "계산하기" 버튼 클릭 또는 프리셋 버튼 클릭 시 즉시 저장

### 불러오기 시점
- 페이지 로드 시 (`DOMContentLoaded`) 히스토리 읽어 태그 렌더링
- URL 쿼리 파라미터 `?amount=` 값이 있으면 자동 계산 실행 후 히스토리 저장

---

## 4. 파일 구조

```
20260523_이석현/
├── index.html                  # 단일 페이지 애플리케이션 진입점
├── style.css                   # 전체 스타일 (CSS 변수, 레이아웃, 애니메이션)
├── app.js                      # 계산 로직, DOM 조작, localStorage 처리
├── data.js                     # 비교 데이터 기준값 상수 모음
├── PRD.md                      # 이 문서
└── .claude/
    └── skills/
        └── frontend-design.md  # 디자인 스킬 가이드
```

---

## 5. 각 파일의 역할과 구현 범위

### `index.html`
- 시맨틱 HTML5 구조 (`<header>`, `<main>`, `<section>`, `<footer>`)
- 금액 입력 폼, 프리셋 버튼 그룹
- 결과 카드 컨테이너 (`#result-grid`)
- 히스토리 태그 컨테이너 (`#history-list`)
- 공유 버튼
- Google Fonts 로드 (display 폰트 + body 폰트)

### `style.css`
- CSS Custom Properties로 색상 토큰 정의
- 레이아웃: CSS Grid (결과 카드), Flexbox (입력부·히스토리)
- 카드 컴포넌트 스타일 (배경, 아이콘 영역, 수치 표시)
- 애니메이션: `@keyframes` — staggered reveal, 카운트업 숫자, hover 인터랙션
- 배경: gradient mesh + SVG noise texture 레이어
- 반응형: `@media` 브레이크포인트 375 / 768 / 1024 / 1440px

### `app.js`
- `calculate(amount)` — data.js 기준값으로 각 카테고리 결과 계산 후 반환
- `renderCards(results)` — 결과 카드 DOM 생성 및 staggered 클래스 적용
- `animateNumber(el, target)` — 카운트업 애니메이션 (requestAnimationFrame)
- `saveHistory(amount)` / `loadHistory()` — localStorage 읽기·쓰기
- `renderHistory()` — 히스토리 태그 렌더링
- `copyShareLink(amount)` — URL 파라미터 생성 + 클립보드 복사
- URL 파라미터 파싱 및 자동 계산 처리 (페이지 로드 시)

### `data.js`
- `ITEMS` 배열: 각 카테고리 객체 (id, name, emoji, price, unit, description)
- 가격 기준 주석 포함 (마지막 업데이트 날짜)

---

## 6. 디자인 방향

> `.claude/skills/frontend-design.md` 가이드라인을 이 프로젝트 맥락에 맞게 구체화

### 콘셉트 키워드
**"영수증처럼 냉정하게, 그러나 감각적으로"** — 소비의 아찔함을 날카롭게 보여주되 시각적으로는 세련된 경험 제공

### 타이포그래피
- Display: **"Space Grotesk"** (Google Fonts) — 숫자와 헤드라인에 사용, 기계적이면서 개성 있는 느낌
- Body: **"Noto Sans KR"** (Google Fonts) — 한글 본문 가독성 최우선
- 금액 수치: 큰 크기(80px~), 자간 좁게, 숫자 모노스페이스 처리 (`font-variant-numeric: tabular-nums`)

### 색상 & 테마
```css
--color-bg:       #0D0F0E;   /* 거의 검정, 약간 녹조 */
--color-surface:  #161A18;   /* 카드 배경 */
--color-border:   #242A27;   /* 카드 테두리 */
--color-accent:   #C6F135;   /* 형광 라임 — 포인트 컬러 */
--color-accent-2: #FF4D1C;   /* 번트 오렌지 — 강조 수치 */
--color-text:     #F0EDE8;   /* 오프화이트 */
--color-muted:    #6B7570;   /* 보조 텍스트 */
```
- 어두운 배경에 형광 라임 포인트: 영수증/터미널 미학을 현대적으로 재해석
- 카드마다 카테고리 색상 accent 틴트 적용 (opacity 레이어)

### 배경 처리
- `background: radial-gradient(ellipse at 20% 50%, #1a2e1a 0%, #0D0F0E 60%)` — 왼쪽에서 번지는 깊은 녹색 gradient mesh
- SVG `<feTurbulence>` 필터로 미세 noise texture 오버레이 (opacity 0.04)
- 우측 상단에 반투명 geometric 원 장식 (CSS only)

### 레이아웃
- 입력 섹션: 좌측 정렬, 큰 금액 타이포그래피가 배경을 압도하는 구성
- 결과 그리드: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` — 가변 컬럼
- 카드: 살짝 기울어진 내부 장식선(::after pseudo) + 왼쪽 상단에 카테고리 이모지 대형 배치
- 히스토리 영역: 입력 섹션 하단에 가로 스크롤 태그 나열

### 모션 & 인터랙션
- 페이지 로드: 헤더 → 입력부 → 히스토리 순 staggered fade-up (0.1s 간격)
- 계산 클릭: 카드 staggered scale-in (각 카드 0.06s 딜레이)
- 카드 hover: `translateY(-6px)` + accent 컬러 border glow (`box-shadow`)
- 수치 카운트업: 0에서 목표값까지 600ms easeOut
- 프리셋 버튼 hover: 배경색 반전 + 미세 회전(2deg)

### 절대 하지 말 것 (이 프로젝트 기준)
- 흰 배경 + 파란 버튼 조합
- 카드에 shadow만 있는 flat 디자인
- 가운데 정렬 + 꽉 찬 단일 컬럼 레이아웃
- 이모지를 아이콘 대체제로만 쓰는 소극적 사용

---

## 7. 비교 데이터 기준값

> 기준일: 2026-05-26 / 가격은 대표적·고정값으로 설정 (실시간 연동 없음)

| ID | 카테고리 | 아이템명 | 기준 단가 | 단위 | 표시 설명 |
|----|----------|----------|-----------|------|-----------|
| `samsung` | 주식 | 삼성전자 주식 | 57,000원/주 | 주(株) | KRX 기준 대략적 단가 |
| `apple` | 주식 | 애플(AAPL) 주식 | 280,000원/주 | 주(株) | USD 200 × 환율 1,400 기준 |
| `gold` | 원자재 | 금 (순금 1g) | 120,000원/g | g | 국내 금 소매가 기준 |
| `starbucks` | 카페 | 스타벅스 아메리카노 (Tall) | 4,500원/잔 | 잔 | 국내 정가 기준 |
| `triangle` | 편의점 | 편의점 참치마요 삼각김밥 | 1,500원/개 | 개 | GS25/CU 평균가 기준 |
| `netflix` | 구독 | 넷플릭스 광고형 멤버십 | 5,500원/월 | 일(환산) | 월 5,500원 ÷ 30일 = 183원/일 |
| `travel` | 여행 | 항공 마일리지 적립 | 20원/마일 | 마일 | 카드 적립 기준 환산가 |

> **참고:** 소수점 결과는 소수점 첫째 자리까지 표시. 0.1개 미만은 "살 수 없어요"로 표시.

---

## 8. 완료 기준 (Definition of Done)

### 기능 완료
- [ ] 금액 입력 → 계산하기 클릭 시 6개 카테고리 카드 모두 정상 렌더링
- [ ] 프리셋 버튼(4종) 클릭 시 즉시 계산 실행
- [ ] localStorage에 히스토리 저장/불러오기 정상 동작 (최대 5개, 중복 제거)
- [ ] 히스토리 태그 클릭 시 해당 금액으로 재계산
- [ ] 히스토리 초기화 버튼 동작
- [ ] 공유 링크 복사 후 해당 URL 접근 시 자동 계산 실행
- [ ] 입력값 유효성 검사 (0 이하, 비숫자 입력 차단 + 사용자 안내 메시지)

### 디자인 완료
- [ ] `.claude/skills/frontend-design.md` 가이드라인 준수 확인
- [ ] 지정 색상 토큰(CSS 변수) 전체 적용
- [ ] Space Grotesk + Noto Sans KR 폰트 로드 확인
- [ ] staggered reveal 애니메이션 동작 (카드 6장)
- [ ] 카드 hover 인터랙션 (translateY + border glow)
- [ ] gradient mesh + noise texture 배경 적용

### 반응형 완료
- [ ] 375px (모바일): 카드 1열, 히스토리 가로 스크롤
- [ ] 768px (태블릿): 카드 2열
- [ ] 1024px+: 카드 3열
- [ ] 1440px+: 카드 3열 최대폭 고정 (max-width 제한)

### 배포 완료
- [ ] Vercel 정적 배포 성공
- [ ] HTTPS 접근 가능
- [ ] 배포 URL에서 공유 링크(`?amount=`) 파라미터 동작 확인

---

*이 PRD는 STEP 1 산출물입니다. STEP 2(구현) 및 STEP 3(배포)에서 이 문서를 기준으로 작업합니다.*
