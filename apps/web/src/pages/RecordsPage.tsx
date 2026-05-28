import type { CheckInType } from "@ailifeos/schemas";
import { CalendarDays, ListChecks, ReceiptText } from "lucide-react";
import { db } from "../core/db/client";
import { formatMoney } from "../core/finance/budget";
import { useLiveQuery } from "../shared/useLiveQuery";

const typeLabels: Record<CheckInType, string> = {
  status: "状态",
  training: "训练",
  stretch: "拉伸",
  nutrition: "饮食",
  sport: "球类",
  plan_change: "变化",
  pain: "疼痛"
};

export function RecordsPage() {
  const checkIns = useLiveQuery(() => db.checkIns.toArray(), []);
  const expenses = useLiveQuery(() => db.expenses.toArray(), []);
  const timeline = [...checkIns].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const recentExpenses = [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  return (
    <section className="module-section page-grid grid-2" aria-label="记录模块">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>打卡类型</h2>
            <p>打卡不是签到，是计划重排和复盘输入。</p>
          </div>
          <ListChecks size={20} aria-hidden="true" />
        </div>
        <ul className="list">
          <li><strong>状态打卡</strong><span>睡眠、疲劳、疼痛、可用时间</span></li>
          <li><strong>训练打卡</strong><span>完成度、RPE、疼痛、备注</span></li>
          <li><strong>拉伸打卡</strong><span>完成情况、紧张部位、不适反馈</span></li>
          <li><strong>饮食打卡</strong><span>蛋白质、碳水、饮水、补给</span></li>
          <li><strong>计划变化</strong><span>跳过、改期、缩短、替换及原因</span></li>
        </ul>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>记录时间线</h2>
            <p>来自 IndexedDB/Dexie，本地优先保存。</p>
          </div>
          <CalendarDays size={20} aria-hidden="true" />
        </div>
        {timeline.length === 0 ? (
          <p className="empty-state">还没有记录。先去今日页做一次状态打卡或训练打卡。</p>
        ) : (
          <ul className="timeline">
            {timeline.slice(0, 10).map((item) => (
              <li key={item.id}>
                <span className="timeline-dot" aria-hidden="true" />
                <div>
                  <strong>{typeLabels[item.type]} · {item.reason ?? "已记录"}</strong>
                  <span>
                    {item.date}
                    {typeof item.fatigue === "number" ? ` · 疲劳 ${item.fatigue}/10` : ""}
                    {typeof item.painLevel === "number" ? ` · 疼痛 ${item.painLevel}/10` : ""}
                  </span>
                  {item.notes ? <p>{item.notes}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="panel span-2">
        <div className="panel-header">
          <div>
            <h2>财务记录摘要</h2>
            <p>第一版只支持手动开销，外部来源字段先保留。</p>
          </div>
          <ReceiptText size={20} aria-hidden="true" />
        </div>
        {recentExpenses.length === 0 ? (
          <p className="empty-state">还没有开销记录。财务页可以新增一笔手动开销。</p>
        ) : (
          <ul className="list">
            {recentExpenses.map((expense) => (
              <li key={expense.id}>
                <div>
                  <strong>{expense.category}</strong>
                  <span>{expense.date} · {expense.source}{expense.notes ? ` · ${expense.notes}` : ""}</span>
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
