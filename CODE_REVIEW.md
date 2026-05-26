# Code Review Results

> 리뷰 대상: `HEAD~3...HEAD` (최근 3개 커밋)
> 실행 스킬: `/code-review --effort high`
> 기준일: 2026-05-27

---

## 리뷰 방법론

3개 독립 앵글(A: 라인별 diff 스캔, B: 제거된 동작 감사, C: 크로스파일 추적) × 최대 6개 후보 → Phase 2 단독 검증 → CONFIRMED/PLAUSIBLE/REFUTED 판정.

---

## 발견 결과 (5건)

```json
[
  {
    "file": "index.html",
    "line": 383,
    "severity": "MEDIUM",
    "verdict": "CONFIRMED",
    "summary": "커서를 항상 끝으로 강제 이동 — 숫자 중간 수정 불가",
    "failure_scenario": "사용자가 '51,000'에서 '5'를 '4'로 수정하려고 커서를 '5' 뒤에 위치시키고 타이핑하면, input 이벤트마다 setSelectionRange(len, len)이 커서를 끝으로 이동시켜 중간 자리 수정이 불가능하다.",
    "note": "자동완성 버그 수정을 위한 의도적 트레이드오프이지만, 사용자가 입력 중간 자리를 수정하려면 끝부터 지워야 한다는 UX 제약이 존재함."
  },
  {
    "file": "index.html",
    "line": 380,
    "severity": "LOW",
    "verdict": "CONFIRMED",
    "summary": "소수점·음수 붙여넣기 시 자릿수 오염 — 사용자 피드백 없음",
    "failure_scenario": "'14,900.50'을 붙여넣으면 replace(/[^\\d]/g, '')가 점과 소수 자리를 제거해 '1490050'이 되고, 사용자에게 아무 오류 메시지 없이 의도와 전혀 다른 값이 입력된다."
  },
  {
    "file": "index.html",
    "line": 84,
    "severity": "LOW",
    "verdict": "CONFIRMED",
    "summary": "정적 HTML에 '8' 하드코딩 — JS 로드 실패 시 잘못된 항목 수 표시",
    "failure_scenario": "JS 로드가 실패하거나 지연되면 '.input-side-value' 요소가 '8'을 표시한다. 실제 ITEMS는 21개이며, 런타임에 line 421에서 갱신되지만 그 전까지는 스테일 값이 노출된다."
  },
  {
    "file": "index.html",
    "line": 367,
    "severity": "LOW",
    "verdict": "CONFIRMED",
    "summary": "calculateBtn은 문자열을 runCalculation에 전달, 프리셋/히스토리는 숫자를 전달 — 타입 불일치",
    "failure_scenario": "현재는 calculate() 내부의 Number() 변환이 커버하므로 런타임 오류 없음. 그러나 프리셋 버튼은 Number(btn.dataset.amount), 히스토리 태그는 entry.amount(숫자)를 전달하는 것과 달리 계산 버튼만 문자열을 전달해 향후 리팩터링 시 NaN 위험이 잠재."
  },
  {
    "file": "data.js",
    "line": 27,
    "severity": "INFO",
    "verdict": "CONFIRMED",
    "summary": "넷플릭스는 버림(7000÷30=233.33→233), 유튜브는 반올림(14900÷30=496.67→497) — 단가 계산 방식 불일치",
    "failure_scenario": "동일 카테고리 내 단가 계산 기준이 다르다. 넷플릭스는 실제보다 낮게, 유튜브는 실제보다 높게 표시된다. 사용자가 description을 신뢰하면 원 금액을 역산할 때 미세한 오차가 발생한다."
  }
]
```

---

## 기각된 후보

| 후보 | 이유 |
|------|------|
| localStorage 키 마이그레이션 누락 (`opportunityCostHistory`) | `opportunityCostHistory` 키는 구 README의 문서 오류였을 뿐 실제 코드에서는 항상 `occ_history`를 사용함. 마이그레이션 불필요. |

---

## 요약

| 심각도 | 건수 |
|--------|------|
| MEDIUM | 1 |
| LOW    | 3 |
| INFO   | 1 |

주요 이슈는 커서-끝-고정 전략(의도적 트레이드오프)과 붙여넣기 시 소수점 무음 삭제이며, 두 이슈 모두 기능 오작동보다는 UX 품질 영역의 결함이다. 크리티컬 버그는 없음.
