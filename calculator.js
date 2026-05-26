/**
 * calculator.js
 * 기회비용 계산 및 localStorage 히스토리 관리 모듈
 */

const HISTORY_KEY = "occ_history";
const HISTORY_MAX = 5;

/**
 * 입력 금액으로 각 아이템을 몇 개 살 수 있는지 계산한다.
 * @param {string|number} amount - 사용자가 입력한 금액
 * @param {Array} dataArray - ITEMS 배열
 * @returns {Array} 계산 결과 배열
 */
function calculate(amount, dataArray) {
  // dataArray 유효성 검사
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    throw new Error("비교 데이터가 없습니다.");
  }

  // amount 유효성 검사
  if (amount === "" || amount === null || amount === undefined) {
    throw new Error("금액을 입력해주세요.");
  }

  const num = Number(amount);

  if (isNaN(num)) {
    throw new Error("올바른 숫자를 입력해주세요.");
  }

  if (num <= 0) {
    throw new Error("0보다 큰 금액을 입력해주세요.");
  }

  return dataArray.map((item) => {
    const raw = num / item.price;
    const quantity = parseFloat(raw.toFixed(1)); // PRD 섹션 7: "소수점 첫째 자리까지 표시"
    const canBuy = quantity >= 0.1; // PRD 섹션 7: "0.1개 미만은 살 수 없어요"

    return {
      ...item,
      quantity,
      canBuy
    };
  });
}

/**
 * 입력 금액을 localStorage 히스토리에 저장한다.
 * - 동일 금액이 존재하면 timestamp만 갱신
 * - 최대 5개 유지, 초과 시 가장 오래된 항목 제거
 * @param {number} amount - 저장할 금액
 */
function saveHistory(amount) {
  try {
    const history = loadHistory();
    const now = new Date().toISOString();
    const num = Number(amount);

    // 동일 금액 중복 제거
    const filtered = history.filter((entry) => entry.amount !== num);

    // 새 항목을 앞에 추가
    filtered.unshift({ amount: num, timestamp: now });

    // 최대 5개 유지
    const trimmed = filtered.slice(0, HISTORY_MAX);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn("히스토리 저장에 실패했습니다.", e);
  }
}

/**
 * localStorage에서 히스토리를 불러온다.
 * timestamp 내림차순(최신순)으로 정렬해 반환한다.
 * @returns {Array} 히스토리 배열 (실패 시 빈 배열)
 */
function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // timestamp 내림차순 정렬
    return parsed.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  } catch (e) {
    return [];
  }
}

/**
 * localStorage에서 히스토리 키를 제거한다.
 */
function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.warn("히스토리 초기화에 실패했습니다.", e);
  }
}

export { calculate, saveHistory, loadHistory, clearHistory };
