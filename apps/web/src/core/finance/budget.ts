import type { ExpenseLog, FinanceDecision, FinanceDecisionResult } from "@ailifeos/schemas";

export const financeBaseline = {
  monthlyIncome: 8000,
  fixedCost: 4500,
  safetyReserve: 1000,
  rewardBudget: 600
};

export interface BudgetSnapshot {
  monthSpent: number;
  rewardSpent: number;
  discretionaryBudget: number;
  discretionaryRemaining: number;
  rewardRemaining: number;
}

export function getBudgetSnapshot(expenses: ExpenseLog[]): BudgetSnapshot {
  const monthSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const rewardSpent = expenses
    .filter((expense) => expense.relatedWishItemId)
    .reduce((sum, expense) => sum + expense.amount, 0);
  const discretionaryBudget =
    financeBaseline.monthlyIncome - financeBaseline.fixedCost - financeBaseline.safetyReserve;

  return {
    monthSpent,
    rewardSpent,
    discretionaryBudget,
    discretionaryRemaining: discretionaryBudget - monthSpent,
    rewardRemaining: financeBaseline.rewardBudget - rewardSpent
  };
}

export function checkWishBudget(input: {
  amount: number;
  targetId?: string;
  expenses: ExpenseLog[];
}): FinanceDecision {
  const snapshot = getBudgetSnapshot(input.expenses);
  const result = decide(input.amount, snapshot);

  return {
    id: crypto.randomUUID(),
    sourceModule: "core/rewards",
    targetType: "wish",
    targetId: input.targetId,
    amount: input.amount,
    result,
    riskLevel: result === "allow" ? "low" : result === "caution" || result === "fund" ? "medium" : "high",
    reasons: buildReasons(input.amount, snapshot, result),
    createdAt: new Date().toISOString()
  };
}

function decide(amount: number, snapshot: BudgetSnapshot): FinanceDecisionResult {
  if (amount <= snapshot.rewardRemaining && amount <= snapshot.discretionaryRemaining) {
    return "allow";
  }
  if (amount <= snapshot.rewardRemaining + 300 && amount <= snapshot.discretionaryRemaining) {
    return "caution";
  }
  if (amount <= snapshot.discretionaryRemaining + 500) {
    return "fund";
  }
  return "delay";
}

function buildReasons(
  amount: number,
  snapshot: BudgetSnapshot,
  result: FinanceDecisionResult
): string[] {
  const reasons = [
    `本月奖励预算剩余 ${formatMoney(snapshot.rewardRemaining)}`,
    `本月自由预算剩余 ${formatMoney(snapshot.discretionaryRemaining)}`
  ];

  if (result === "allow") {
    reasons.push("当前预算允许兑换，但仍需要用户手动确认真实消费。");
  } else if (result === "caution") {
    reasons.push("接近奖励预算上限，建议确认本周是否还有必要支出。");
  } else if (result === "fund") {
    reasons.push(`心愿金额 ${formatMoney(amount)} 偏高，建议转入心愿基金分次积累。`);
  } else {
    reasons.push("当前预算不适合兑换，建议推迟到下个周期。");
  }

  return reasons;
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0
  }).format(value);
}
