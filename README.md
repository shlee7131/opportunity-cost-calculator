# 오늘 커피값으로 뭘 살 수 있었을까? — 소비 기회비용 계산기

금액을 입력하면 그 돈으로 살 수 있는 것들을 6개 카테고리(주식·원자재·생활비·구독·여행·기타)로 카드 형태로 시각화해 소비의 기회비용을 새로운 관점으로 보여주는 웹 도구.

---

## 사용된 스킬 및 에이전트 구성

| 역할 | 에이전트 / 스킬 |
|------|----------------|
| 기획 · PRD 작성 | `document-skills:frontend-design` 스킬 |
| UI 구현 (HTML/CSS) | `frontend-developer` 에이전트 |
| 데이터 · 로직 구현 (JS) | `backend-developer` 에이전트 |
| 코드 리뷰 | `code-reviewer` 에이전트 |
| 통합 테스트 | `integration-tester` 에이전트 |

---

## localStorage 활용 내용

- **히스토리 저장**: 사용자가 계산한 금액과 타임스탬프를 `opportunityCostHistory` 키로 저장 (최대 10건 유지)
- **재방문 시 자동 로드**: 페이지 진입 시 저장된 히스토리를 불러와 사이드바에 표시
- **히스토리 삭제**: 전체 초기화 버튼으로 `localStorage` 항목 완전 제거

---

## 로컬 실행 방법

별도 빌드 없이 정적 파일로 동작합니다.  
ES Module(`import`/`export`) 사용으로 **로컬 파일 직접 열기(file://)는 불가**하며, 간단한 HTTP 서버가 필요합니다.

```bash
# Node.js가 설치된 경우
npx serve .

# Python 3이 설치된 경우
python -m http.server 8080
```

브라우저에서 `http://localhost:8080` (또는 `http://localhost:3000`) 접속.

---

## 배포 링크

> [배포 후 Vercel URL로 교체하세요]  
> `https://<your-project>.vercel.app`
