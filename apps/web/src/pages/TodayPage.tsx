import type { CheckIn, PlanMode } from "@ailifeos/schemas";
import type { ReactNode } from "react";
import { CheckCircle2, Clock3, Dumbbell, Moon, RotateCcw, Trophy, Utensils } from "lucide-react";
import { useMemo, useState } from "react";
import { db } from "../core/db/client";
import { dailyPlans, getSuggestedMode } from "../modules/training/data";

const modeLabels: Record<PlanMode, string> = {
  standard: "标准训练",
  short: "只有 20 分钟",
  sport: "今晚打球",
  recovery: "恢复日",
  skip: "今天不练"
};

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function TodayPage() {
  const [fatigue, setFatigue] = useState(4);
  const [painLevel, setPainLevel] = useState(0);
  const [availableMinutes, setAvailableMinutes] = useState(45);
  const [hasSportToday, setHasSportToday] = useState(false);
  const [mode, setMode] = useState<PlanMode>("standard");
  const [message, setMessage] = useState("先完成状态打卡，再按今日计划执行。");

  const suggestedMode = useMemo(
    () => getSuggestedMode({ fatigue, painLevel, availableMinutes, hasSportToday }),
    [availableMinutes, fatigue, hasSportToday, painLevel]
  );
  const activePlan = dailyPlans[mode];

  async function saveStatusCheckIn() {
    await addCheckIn({
      type: "status",
      fatigue,
      painLevel,
      availableMinutes,
      reason: hasSportToday ? "今天有球类活动" : undefined,
      notes: `系统建议：${modeLabels[suggestedMode]}`
    });
    setMode(suggestedMode);
    setMessage(`状态已记录，今日建议切换为「${modeLabels[suggestedMode]}」。`);
  }

  async function recordOutcome(type: "training" | "stretch" | "nutrition" | "plan_change", reason: string) {
    const completionRate = type === "plan_change" ? 0 : mode === "skip" ? 0 : 100;
    await addCheckIn({
      type,
      fatigue,
      painLevel,
      availableMinutes,
      completionRate,
      reason,
      notes: `${activePlan.title} · ${activePlan.loadLabel}`,
      validForReward: true
    });
    setMessage(`已记录：${reason}。有效打卡会进入愿望激励系统。`);
  }

  return (
    <section className="page-grid grid-2" aria-labelledby="today-title">
      <div className="panel span-2">
        <div className="panel-header">
          <div>
            <h2 id="today-title">今日状态</h2>
            <p>先输入真实状态，系统再决定标准训练、降级、球类日或跳过记录。</p>
          </div>
          <span className={suggestedMode === "standard" ? "pill ok" : "pill warn"}>
            建议：{modeLabels[suggestedMode]}
          </span>
        </div>

        <div className="control-grid">
          <label className="field">
            <span>疲劳程度</span>
            <input
              max="10"
              min="0"
              onChange={(event) => setFatigue(Number(event.target.value))}
              type="range"
              value={fatigue}
            />
            <strong>{fatigue}/10</strong>
          </label>
          <label className="field">
            <span>疼痛程度</span>
            <input
              max="10"
              min="0"
              onChange={(event) => setPainLevel(Number(event.target.value))}
              type="range"
              value={painLevel}
            />
            <strong>{painLevel}/10</strong>
          </label>
          <label className="field">
            <span>可训练时间</span>
            <input
              min="0"
              onChange={(event) => setAvailableMinutes(Number(event.target.value))}
              step="5"
              type="number"
              value={availableMinutes}
            />
            <strong>{availableMinutes} 分钟</strong>
          </label>
          <label className="toggle-field">
            <input
              checked={hasSportToday}
              onChange={(event) => setHasSportToday(event.target.checked)}
              type="checkbox"
            />
            <span>今天有羽毛球、网球或网球课</span>
          </label>
        </div>

        <div className="button-row">
          <button className="primary-button" type="button" onClick={() => void saveStatusCheckIn()}>
            <CheckCircle2 size={17} aria-hidden="true" />
            保存状态并重排
          </button>
          <button className="secondary-button" type="button" onClick={() => setMode("short")}>
            <Clock3 size={17} aria-hidden="true" />
            只有 20 分钟
          </button>
          <button className="secondary-button" type="button" onClick={() => setMode("sport")}>
            <Trophy size={17} aria-hidden="true" />
            晚上要打球
          </button>
          <button className="secondary-button" type="button" onClick={() => setMode("skip")}>
            <Moon size={17} aria-hidden="true" />
            今天不练
          </button>
        </div>
        <div className="inline-note">
          <RotateCcw size={16} aria-hidden="true" />
          <span>{message}</span>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>{activePlan.title}</h2>
            <p>{activePlan.summary}</p>
          </div>
          <span className="pill ok">{activePlan.loadLabel}</span>
        </div>
        <p className="reason">{activePlan.reason}</p>

        <div className="segmented" aria-label="今日计划模式">
          {(Object.keys(modeLabels) as PlanMode[]).map((item) => (
            <button
              className={item === mode ? "active" : ""}
              key={item}
              type="button"
              onClick={() => setMode(item)}
            >
              {modeLabels[item]}
            </button>
          ))}
        </div>

        <PlanList icon={<Dumbbell size={18} />} title="训练主体" items={activePlan.training} />
        <PlanList icon={<RotateCcw size={18} />} title="训练后拉伸" items={activePlan.stretch} />
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>今日饮食与风险</h2>
            <p>饮食跟随训练变化，不和计划割裂。</p>
          </div>
          <Utensils size={20} aria-hidden="true" />
        </div>

        <PlanList icon={<Utensils size={18} />} title="饮食安排" items={activePlan.nutrition} />

        <ul className="risk-list">
          {activePlan.riskNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>

        <div className="button-row">
          <button
            className="primary-button"
            type="button"
            onClick={() => void recordOutcome("training", "训练完成")}
          >
            <CheckCircle2 size={17} aria-hidden="true" />
            训练完成
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={() => void recordOutcome("stretch", "拉伸完成")}
          >
            拉伸打卡
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={() => void recordOutcome("nutrition", "饮食已执行")}
          >
            饮食打卡
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={() => void recordOutcome("plan_change", "今日计划变化")}
          >
            记录变化
          </button>
        </div>
      </div>
    </section>
  );
}

function PlanList(props: {
  icon: ReactNode;
  title: string;
  items: Array<{ id: string; title: string; detail: string; tag: string }>;
}) {
  return (
    <div className="plan-block">
      <h3>
        {props.icon}
        {props.title}
      </h3>
      <ul className="list compact-list">
        {props.items.map((item) => (
          <li key={item.id}>
            <div>
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </div>
            <span className="pill">{item.tag}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function addCheckIn(input: Omit<CheckIn, "id" | "date" | "sourceModule" | "createdAt">) {
  const now = new Date().toISOString();
  const checkIn: CheckIn = {
    id: crypto.randomUUID(),
    date: todayString(),
    sourceModule: "training",
    createdAt: now,
    ...input
  };

  await db.checkIns.add(checkIn);
}
