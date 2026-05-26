# 오늘 커피값으로 뭘 살 수 있었을까? — 소비 기회비용 계산기

금액을 입력하면 그 돈으로 살 수 있는 것들을 21개 카테고리(주식·원자재·카페·음식·구독·교통 등)에서 랜덤 6개를 골라 카드로 시각화해, 소비의 기회비용을 새로운 관점으로 보여주는 웹 도구.

**[라이브 데모]** https://opportunity-cost-calculator-dusky.vercel.app

---

## 기술 스택

| 구분 | 내용 |
|------|------|
| 언어 | HTML5 · CSS3 · Vanilla JavaScript (ES Modules) |
| 빌드 도구 | 없음 (정적 파일 그대로 서빙) |
| 데이터 저장 | `localStorage` |
| 배포 | Vercel (정적 호스팅) |

---

## 파일 구조

```
.
├── index.html          # UI 및 인라인 모듈 스크립트 (메인 진입점)
├── style.css           # 전체 스타일 (다크 테마, 반응형 그리드)
├── data.js             # 비교 아이템 21종 데이터 (가격·단위·이모지·카테고리)
├── calculator.js       # 계산 로직 + localStorage 히스토리 관리
├── vercel.json         # Vercel 정적 배포 설정
├── PRD.md              # 기획 요구사항 문서
├── REVIEW.md           # 코드 리뷰 결과
└── TEST_REPORT.md      # 통합 테스트 결과
```

---

## 주요 기능

- **기회비용 계산**: 금액 입력 → 21개 풀에서 랜덤 6개 카드 표시
- **콤마 포맷팅**: 입력 중 세 자리마다 자동 콤마 삽입 (예: `50,000`)
- **프리셋 버튼**: 4,500 / 6,000 / 10,000 / 50,000원 빠른 선택
- **카운트업 애니메이션**: 결과 숫자가 0에서 올라오는 효과
- **공유 링크**: URL 파라미터(`?amount=N`)로 특정 금액 결과 공유
- **히스토리**: 최근 5건 localStorage 저장, 재클릭 시 즉시 재계산

---

## localStorage 활용

| 키 | 내용 |
|----|------|
| `occ_history` | 계산한 금액·타임스탬프 배열 (최대 5건, 최신순 정렬) |

재방문 시 히스토리를 자동 로드해 이전 계산을 빠르게 재실행할 수 있습니다. 히스토리 초기화 버튼으로 완전 삭제 가능.

---

## 사용된 에이전트 구성

| 역할 | 에이전트 |
|------|----------|
| UI 구현 (HTML/CSS) | `frontend-developer` |
| 데이터·로직 구현 (JS) | `backend-developer` |
| 코드 리뷰 | `code-reviewer` |
| 통합 테스트 | `integration-tester` |
| 가격 데이터 최신화 | `price-updater` |

---

## 로컬 실행 방법

ES Module(`import`/`export`) 사용으로 파일을 직접 열면(`file://`) 동작하지 않습니다.
간단한 HTTP 서버가 필요합니다.

```bash
# Node.js npx (별도 설치 불필요)
npx serve .

# Node.js http-server
npx http-server . -p 8080
```

브라우저에서 `http://localhost:3000` (또는 표시된 포트) 접속.

---

## 가격 데이터 최신화

비교 아이템 가격은 `data.js`에서 관리합니다. 주기적 업데이트가 필요할 경우 `price-updater` 에이전트를 실행하세요.

```
현재 기준일: 2026-05-27
```
