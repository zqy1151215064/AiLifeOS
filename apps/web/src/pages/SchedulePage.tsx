import type { CheckIn } from "@ailifeos/schemas";
import { CalendarPlus, Repeat, TimerReset } from "lucide-react";
import { db } from "../core/db/client";
import { scheduleEvents } from "../modules/training/data";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function SchedulePage() {
  async function recordPlanChange(reason: string) {
    const now = new Date().toISOString();
    const checkIn: CheckIn = {
      id: crypto.randomUUID(),
      type: "plan_change",
      date: todayString(),
      sourceModule: "training",
      createdAt: now,
      reason,
      notes: `日程变化：${reason}`,
      validForReward: true
    };

    await db.checkIns.add(checkIn);
  }

  return (
    <section className="module-section page-grid grid-2" aria-label="日程与计划变化">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>固定与临时事件</h2>
            <p>系统先处理真实日程，再安排训练。</p>
          </div>
          <Repeat size={20} aria-hidden="true" />
        </div>
        <ul className="list">
          {scheduleEvents.map((event) => (
            <li key={event.id}>
              <div>
                <strong>{event.title}</strong>
                <span>{event.timeLabel} · {event.notes}</span>
              </div>
              <span className="pill">{event.intensity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>今日变化</h2>
            <p>变化不删除计划，而是留下原因并触发重排。</p>
          </div>
          <CalendarPlus size={20} aria-hidden="true" />
        </div>
        <div className="button-row compact">
          <button className="secondary-button" type="button" onClick={() => void recordPlanChange("晚上有网球课")}>
            晚上有网球课
          </button>
          <button className="secondary-button" type="button" onClick={() => void recordPlanChange("今天只有 20 分钟")}>
            只有 20 分钟
          </button>
          <button className="secondary-button" type="button" onClick={() => void recordPlanChange("今天不想练")}>
            今天不想练
          </button>
        </div>

        <div className="inline-note">
          <TimerReset size={16} aria-hidden="true" />
          <span>这些操作会写入记录页，后续用于周复盘和计划调整。</span>
        </div>
      </div>
    </section>
  );
}
