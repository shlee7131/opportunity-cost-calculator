---
description: 이 프로젝트의 프론트엔드 디자인 가이드라인. index.html·style.css 작성 또는 수정 시, UI 디자인 방향을 결정할 때, 코드 리뷰에서 디자인 기준을 적용할 때 사용한다.
---

# Frontend Design Guideline

## 1. 타이포그래피
- Arial, Inter, Roboto 같은 generic 폰트 사용 금지
- 개성 있는 display 폰트 + refined body 폰트 조합 필수

## 2. 색상 & 테마
- CSS 변수로 일관된 색상 체계 구성
- 보라색 그라디언트 등 진부한 배색 금지
- 강한 포인트 컬러 + 지배적인 메인 컬러 조합 사용

## 3. 모션 & 인터랙션
- CSS-only 애니메이션 우선 사용
- 페이지 로드 시 staggered reveal 효과 적용
- hover 상태에서 놀라움을 주는 인터랙션 추가

## 4. 공간 구성
- 비대칭, 오버랩, 대각선 흐름 등 예상치 못한 레이아웃 사용
- grid-breaking 요소 적극 활용

## 5. 배경 & 시각적 디테일
- 단색 배경 지양
- gradient mesh, noise texture, geometric pattern 등 활용해 분위기 형성

## 6. 절대 하지 말 것
- generic AI 스타일의 평범한 디자인 금지
- 예측 가능한 레이아웃 패턴 금지
- 모든 디자인은 반드시 이 프로젝트 맥락에 맞게 독창적으로 구성
