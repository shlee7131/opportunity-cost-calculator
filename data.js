// 기준일: 2026-05-26

const ITEMS = [
  // 주식
  { id: "samsung",   name: "삼성전자 주식",              price: 57000,  unit: "주",   emoji: "📈", description: "KRX 기준 대략적 단가",                 category: "stock"        },
  { id: "apple",     name: "애플(AAPL) 주식",             price: 280000, unit: "주",   emoji: "🍎", description: "USD 200 × 환율 1,400 기준",             category: "stock"        },
  { id: "kakao",     name: "카카오 주식",                 price: 35000,  unit: "주",   emoji: "💬", description: "KRX 기준 대략적 단가",                 category: "stock"        },

  // 원자재
  { id: "gold",      name: "금 (순금 1g)",                price: 120000, unit: "g",    emoji: "🪙", description: "국내 금 소매가 기준",                  category: "commodity"    },
  { id: "gasoline",  name: "휘발유",                      price: 1700,   unit: "L",    emoji: "⛽", description: "전국 평균 주유가 기준",                category: "commodity"    },

  // 카페 · 음료
  { id: "starbucks", name: "스타벅스 아메리카노 (Tall)",  price: 4500,   unit: "잔",   emoji: "☕", description: "국내 정가 기준",                       category: "cafe"         },
  { id: "latte",     name: "카페라테 (Grande)",           price: 5900,   unit: "잔",   emoji: "🥛", description: "국내 주요 카페 평균가 기준",           category: "cafe"         },
  { id: "beer",      name: "편의점 캔맥주 (500ml)",       price: 2000,   unit: "캔",   emoji: "🍺", description: "GS25/CU 기준",                         category: "convenience"  },
  { id: "energy",    name: "에너지드링크 (250ml)",        price: 2000,   unit: "캔",   emoji: "⚡", description: "편의점 기준",                          category: "convenience"  },

  // 음식
  { id: "triangle",  name: "편의점 참치마요 삼각김밥",   price: 1500,   unit: "개",   emoji: "🍙", description: "GS25/CU 평균가 기준",                  category: "convenience"  },
  { id: "bigmac",    name: "맥도날드 빅맥 세트",         price: 8500,   unit: "세트", emoji: "🍔", description: "국내 매장 기준",                       category: "food"         },
  { id: "chicken",   name: "후라이드 치킨 (배달)",       price: 22000,  unit: "마리", emoji: "🍗", description: "배달 기준 평균가",                     category: "food"         },
  { id: "soju",      name: "편의점 소주 (360ml)",        price: 1800,   unit: "병",   emoji: "🍶", description: "참이슬·처음처럼 편의점가",             category: "convenience"  },
  { id: "cigarette", name: "담배 한 개비",               price: 225,    unit: "개비", emoji: "🚬", description: "4,500원 한 갑 ÷ 20개비",              category: "lifestyle"    },

  // 구독 · 엔터
  { id: "netflix",   name: "넷플릭스 광고형 멤버십",     price: 183,    unit: "일",   emoji: "🎬", description: "월 5,500원 ÷ 30일 = 183원/일",        category: "subscription" },
  { id: "youtube",   name: "유튜브 프리미엄",            price: 497,    unit: "일",   emoji: "📺", description: "월 14,900원 ÷ 30일 ≈ 497원/일",      category: "subscription" },
  { id: "lotto",     name: "로또 1장",                  price: 1000,   unit: "장",   emoji: "🎰", description: "매주 토요일 추첨",                     category: "lifestyle"    },

  // 교통 · 여행
  { id: "bus",       name: "시내버스 1회",               price: 1400,   unit: "회",   emoji: "🚌", description: "서울 시내버스 기준",                   category: "transport"    },
  { id: "parking",   name: "공영주차장 (시내)",          price: 200,    unit: "분",   emoji: "🚗", description: "서울 시내 공영주차장 기준",            category: "transport"    },
  { id: "ktx",       name: "KTX 서울-부산",             price: 59800,  unit: "편",   emoji: "🚄", description: "일반실 정상가 기준",                   category: "transport"    },
  { id: "travel",    name: "항공 마일리지 적립",         price: 20,     unit: "마일", emoji: "✈️", description: "카드 적립 기준 환산가",               category: "travel"       },
];

export default ITEMS;
