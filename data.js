// 기준일: 2026-05-26

const ITEMS = [
  {
    id: "samsung",
    name: "삼성전자 주식",
    price: 57000,
    unit: "주",
    emoji: "📈",
    description: "KRX 기준 대략적 단가",
    category: "stock"
  },
  {
    id: "apple",
    name: "애플(AAPL) 주식",
    price: 280000,
    unit: "주",
    emoji: "🍎",
    description: "USD 200 × 환율 1,400 기준",
    category: "stock"
  },
  {
    id: "gold",
    name: "금 (순금 1g)",
    price: 120000,
    unit: "g",
    emoji: "🪙",
    description: "국내 금 소매가 기준",
    category: "commodity"
  },
  {
    id: "starbucks",
    name: "스타벅스 아메리카노 (Tall)",
    price: 4500,
    unit: "잔",
    emoji: "☕",
    description: "국내 정가 기준",
    category: "cafe"
  },
  {
    id: "triangle",
    name: "편의점 참치마요 삼각김밥",
    price: 1500,
    unit: "개",
    emoji: "🍙",
    description: "GS25/CU 평균가 기준",
    category: "convenience"
  },
  {
    id: "netflix",
    name: "넷플릭스 광고형 멤버십",
    price: 183,
    unit: "일",
    emoji: "🎬",
    description: "월 5,500원 ÷ 30일 = 183원/일",
    category: "subscription"
  },
  {
    id: "travel",
    name: "항공 마일리지 적립",
    price: 20,
    unit: "마일",
    emoji: "✈️",
    description: "카드 적립 기준 환산가",
    category: "travel"
  },
  {
    id: "latte",
    name: "카페라테 (Grande)",
    price: 5900,
    unit: "잔",
    emoji: "🥛",
    description: "국내 주요 카페 평균가 기준",
    category: "cafe"
  }
];

export default ITEMS;
