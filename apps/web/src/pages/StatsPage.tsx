import type { ReactNode } from "react";
import { BarChart3, Coins, Image as ImageIcon, ListChecks } from "lucide-react";
import { db } from "../core/db/client";
import { formatMoney, getBudgetSnapshot } from "../core/finance/budget";
import { useLiveQuery } from "../shared/useLiveQuery";

export function StatsPage() {
  const checkIns = useLiveQuery(() => db.checkIns.toArray(), []);
  const expenses = useLiveQuery(() => db.expenses.toArray(), []);
  const imageAssets = useLiveQuery(() => db.imageAssets.toArray(), []);
  const snapshot = getBudgetSnapshot(expenses);
  const rewardCards = checkIns.filter((item) => item.validForReward !== false).length;
  const completedTraining = checkIns.filter((item) => item.type === "training").length;

  return (
    <section className="module-section page-grid grid-2" aria-label="统计复盘">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>执行概览</h2>
            <p>先用本地记录形成最小复盘，不做复杂 BI。</p>
          </div>
          <BarChart3 size={20} aria-hidden="true" />
        </div>
        <div className="metric-grid">
          <Metric icon={<ListChecks size={18} />} label="有效打卡" value={`${rewardCards} 次`} />
          <Metric icon={<ListChecks size={18} />} label="训练完成" value={`${completedTraining} 次`} />
          <Metric icon={<ImageIcon size={18} />} label="动作图资产" value={`${imageAssets.length} 张`} />
          <Metric icon={<Coins size={18} />} label="本月支出" value={formatMoney(snapshot.monthSpent)} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>复盘提示</h2>
            <p>当前规则保守，优先避免计划过载。</p>
          </div>
          <span className="pill ok">local-first</span>
        </div>
        <ul className="list">
          <li><strong>训练</strong><span>{completedTraining > 0 ? "已有训练记录，可以开始观察完成率。" : "还没有训练记录，先从今日页完成一次打卡。"}</span></li>
          <li><strong>激励</strong><span>{rewardCards >= 3 ? "已达到小盲盒触发条件。" : "有效打卡满 3 次后可以开小盲盒。"}</span></li>
          <li><strong>财务</strong><span>奖励预算剩余 {formatMoney(snapshot.rewardRemaining)}。</span></li>
        </ul>
      </div>
    </section>
  );
}

function Metric(props: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="metric">
      <span className="metric-icon">{props.icon}</span>
      <span>{props.label}</span>
      <strong>{props.value}</strong>
    </div>
  );
}
