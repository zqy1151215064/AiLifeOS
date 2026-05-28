import type { FinanceDecision, WishItem } from "@ailifeos/schemas";
import { Gift, Sparkles, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { db } from "../core/db/client";
import { checkWishBudget, formatMoney } from "../core/finance/budget";
import { wishItems } from "../modules/training/data";
import { useLiveQuery } from "../shared/useLiveQuery";

export function RewardsPage() {
  const checkIns = useLiveQuery(() => db.checkIns.toArray(), []);
  const expenses = useLiveQuery(() => db.expenses.toArray(), []);
  const [drawResult, setDrawResult] = useState<{ wish: WishItem; decision: FinanceDecision } | null>(null);
  const rewardCards = checkIns.filter((item) => item.validForReward !== false).length;
  const smallBoxReady = rewardCards >= 3;
  const standardBoxReady = rewardCards >= 7;

  const albumProgress = useMemo(
    () => [
      { title: "训练启动卡册", value: Math.min(rewardCards, 3), target: 3 },
      { title: "稳定执行卡册", value: Math.min(rewardCards, 7), target: 7 }
    ],
    [rewardCards]
  );

  function openBlindBox() {
    if (!smallBoxReady) {
      return;
    }
    const wish = wishItems[rewardCards % wishItems.length];
    const decision = checkWishBudget({ amount: wish.cost - wish.fundSaved, targetId: wish.id, expenses });
    setDrawResult({ wish, decision });
  }

  return (
    <section className="module-section page-grid grid-2" aria-label="愿望激励模块">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>卡片与盲盒</h2>
            <p>有效打卡发卡，抽中不等于自动消费。</p>
          </div>
          <Sparkles size={20} aria-hidden="true" />
        </div>
        <div className="metric-grid">
          <div className="metric">
            <span className="metric-icon"><Gift size={18} aria-hidden="true" /></span>
            <span>有效卡片</span>
            <strong>{rewardCards} 张</strong>
          </div>
          <div className="metric">
            <span className="metric-icon"><Gift size={18} aria-hidden="true" /></span>
            <span>小盲盒</span>
            <strong>{smallBoxReady ? "可开启" : `${Math.max(0, 3 - rewardCards)} 张后`}</strong>
          </div>
          <div className="metric">
            <span className="metric-icon"><WalletCards size={18} aria-hidden="true" /></span>
            <span>标准盲盒</span>
            <strong>{standardBoxReady ? "可开启" : `${Math.max(0, 7 - rewardCards)} 张后`}</strong>
          </div>
        </div>
        <div className="button-row">
          <button className="primary-button" disabled={!smallBoxReady} type="button" onClick={openBlindBox}>
            <Gift size={17} aria-hidden="true" />
            开小盲盒
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>卡册进度</h2>
            <p>恢复、降级、合理跳过也可以是有效行为。</p>
          </div>
          <span className="pill ok">非惩罚</span>
        </div>
        <div className="stack">
          {albumProgress.map((album) => (
            <div className="progress-block" key={album.title}>
              <div>
                <strong>{album.title}</strong>
                <span>{album.value}/{album.target}</span>
              </div>
              <progress max={album.target} value={album.value} />
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>心愿清单</h2>
            <p>盲盒奖项只能来自你自己的心愿。</p>
          </div>
          <span className="pill ok">Core</span>
        </div>
        <ul className="list">
          {wishItems.map((wish) => (
            <li key={wish.id}>
              <div>
                <strong>{wish.title}</strong>
                <span>{wish.category} · 已存 {formatMoney(wish.fundSaved)}</span>
              </div>
              <span className="pill">{formatMoney(wish.cost)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>抽取结果</h2>
            <p>兑换前必须通过 Core 财务预算检查。</p>
          </div>
          <WalletCards size={20} aria-hidden="true" />
        </div>
        {drawResult ? (
          <div className="stack">
            <div className="result-box">
              <strong>{drawResult.wish.title}</strong>
              <span>待确认金额 {formatMoney(drawResult.wish.cost - drawResult.wish.fundSaved)}</span>
            </div>
            <span className={drawResult.decision.result === "allow" ? "pill ok" : "pill warn"}>
              {drawResult.decision.result}
            </span>
            <ul className="risk-list">
              {drawResult.decision.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="empty-state">有效打卡满 3 张后可以开启小盲盒。</p>
        )}
      </div>
    </section>
  );
}
