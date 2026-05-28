import type { ExpenseLog } from "@ailifeos/schemas";
import { Coins, Plus, ShieldCheck, WalletCards } from "lucide-react";
import { FormEvent, useState } from "react";
import { db } from "../core/db/client";
import { financeBaseline, formatMoney, getBudgetSnapshot } from "../core/finance/budget";
import { wishItems } from "../modules/training/data";
import { useLiveQuery } from "../shared/useLiveQuery";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function FinancePage() {
  const expenses = useLiveQuery(() => db.expenses.toArray(), []);
  const snapshot = getBudgetSnapshot(expenses);
  const [amount, setAmount] = useState("39");
  const [category, setCategory] = useState("餐饮");
  const [paymentMethod, setPaymentMethod] = useState("支付宝");
  const [relatedWishItemId, setRelatedWishItemId] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("V1 先手动记录，不接入外部账单。");

  async function submitExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setMessage("金额必须大于 0。");
      return;
    }

    const expense: ExpenseLog = {
      id: crypto.randomUUID(),
      amount: parsedAmount,
      category,
      date: todayString(),
      paymentMethod,
      source: "manual",
      relatedWishItemId: relatedWishItemId || undefined,
      notes: notes || undefined
    };

    await db.expenses.add(expense);
    setMessage(`已记录 ${formatMoney(parsedAmount)}，预算状态已更新。`);
    setNotes("");
  }

  return (
    <section className="module-section page-grid grid-2" aria-label="Core 财务模块">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>预算守护</h2>
            <p>财务是 Core 模块，不属于激励系统。</p>
          </div>
          <ShieldCheck size={20} aria-hidden="true" />
        </div>
        <div className="metric-grid">
          <Metric label="月收入" value={formatMoney(financeBaseline.monthlyIncome)} />
          <Metric label="固定支出" value={formatMoney(financeBaseline.fixedCost)} />
          <Metric label="自由预算剩余" value={formatMoney(snapshot.discretionaryRemaining)} />
          <Metric label="奖励预算剩余" value={formatMoney(snapshot.rewardRemaining)} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>手动开销</h2>
            <p>第一版由用户自己添加，保留来源字段。</p>
          </div>
          <Plus size={20} aria-hidden="true" />
        </div>
        <form className="form-grid" onSubmit={(event) => void submitExpense(event)}>
          <label className="field">
            <span>金额</span>
            <input min="0" onChange={(event) => setAmount(event.target.value)} step="0.01" type="number" value={amount} />
          </label>
          <label className="field">
            <span>分类</span>
            <select onChange={(event) => setCategory(event.target.value)} value={category}>
              <option>餐饮</option>
              <option>交通</option>
              <option>训练装备</option>
              <option>课程</option>
              <option>旅行</option>
              <option>订阅工具</option>
            </select>
          </label>
          <label className="field">
            <span>支付方式</span>
            <input onChange={(event) => setPaymentMethod(event.target.value)} value={paymentMethod} />
          </label>
          <label className="field">
            <span>关联心愿</span>
            <select onChange={(event) => setRelatedWishItemId(event.target.value)} value={relatedWishItemId}>
              <option value="">不关联</option>
              {wishItems.map((wish) => (
                <option key={wish.id} value={wish.id}>{wish.title}</option>
              ))}
            </select>
          </label>
          <label className="field span-2">
            <span>备注</span>
            <input onChange={(event) => setNotes(event.target.value)} placeholder="例如：网球课后晚餐" value={notes} />
          </label>
          <button className="primary-button" type="submit">
            <Plus size={17} aria-hidden="true" />
            新增开销
          </button>
        </form>
        <div className="inline-note">
          <WalletCards size={16} aria-hidden="true" />
          <span>{message}</span>
        </div>
      </div>

      <div className="panel span-2">
        <div className="panel-header">
          <div>
            <h2>最近开销</h2>
            <p>后续可接 CSV、截图识别或只读账单导入，V1 不自动同步。</p>
          </div>
          <Coins size={20} aria-hidden="true" />
        </div>
        {expenses.length === 0 ? (
          <p className="empty-state">还没有开销记录。</p>
        ) : (
          <ul className="list">
            {[...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8).map((expense) => (
              <li key={expense.id}>
                <div>
                  <strong>{expense.category}</strong>
                  <span>{expense.date} · {expense.paymentMethod ?? "手动"} · {expense.source}</span>
                </div>
                <span className="pill warn">{formatMoney(expense.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Metric(props: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{props.label}</span>
      <strong>{props.value}</strong>
    </div>
  );
}
