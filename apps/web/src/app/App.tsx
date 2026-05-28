import {
  Activity,
  BarChart3,
  CalendarDays,
  Dumbbell,
  Image,
  Layers3,
  Sparkles,
  UserRound,
  WalletCards
} from "lucide-react";
import { useState } from "react";
import { AssetsPage } from "../pages/AssetsPage";
import { FinancePage } from "../pages/FinancePage";
import { ProfilePage } from "../pages/ProfilePage";
import { RecordsPage } from "../pages/RecordsPage";
import { RewardsPage } from "../pages/RewardsPage";
import { SchedulePage } from "../pages/SchedulePage";
import { StatsPage } from "../pages/StatsPage";
import { TodayPage } from "../pages/TodayPage";
import { TrainingPage } from "../pages/TrainingPage";

type PageId =
  | "today"
  | "profile"
  | "schedule"
  | "training"
  | "records"
  | "rewards"
  | "finance"
  | "assets"
  | "stats";

const pages: Array<{
  id: PageId;
  label: string;
  description: string;
  title: string;
  icon: typeof Activity;
}> = [
  { id: "today", label: "今日", title: "今日入口", description: "训练、拉伸、饮食和风险", icon: Activity },
  { id: "profile", label: "档案", title: "个人档案", description: "目标、背景和安全边界", icon: UserRound },
  { id: "schedule", label: "日程", title: "日程与变化", description: "固定球局和临时安排", icon: CalendarDays },
  { id: "training", label: "训练", title: "训练与饮食", description: "周任务池和动作库", icon: Dumbbell },
  { id: "records", label: "记录", title: "记录时间线", description: "打卡与开销记录", icon: CalendarDays },
  { id: "rewards", label: "激励", title: "愿望激励", description: "心愿、卡片和盲盒", icon: Sparkles },
  { id: "finance", label: "财务", title: "Core 财务", description: "预算和手动开销", icon: WalletCards },
  { id: "assets", label: "资源", title: "动作图资源", description: "image2 生成和复用", icon: Image },
  { id: "stats", label: "统计", title: "统计复盘", description: "执行、预算和资产", icon: BarChart3 }
];

export function App() {
  const [activePage, setActivePage] = useState<PageId>("today");
  const currentPage = pages.find((page) => page.id === activePage) ?? pages[0];

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="AiLifeOS navigation">
        <div className="brand">
          <div className="brand-mark">
            <Layers3 size={20} aria-hidden="true" />
          </div>
          <div>
            <strong>AiLifeOS</strong>
            <span>V1 MVP</span>
          </div>
        </div>

        <nav className="nav-list">
          {pages.map((page) => {
            const Icon = page.icon;
            const selected = page.id === activePage;
            return (
              <button
                className={selected ? "nav-item active" : "nav-item"}
                key={page.id}
                type="button"
                aria-current={selected ? "page" : undefined}
                onClick={() => setActivePage(page.id)}
              >
                <Icon size={18} aria-hidden="true" />
                <span>
                  <strong>{page.label}</strong>
                  <small>{page.description}</small>
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <span className="eyebrow">本地优先 · monorepo · React + Go</span>
            <h1>{currentPage.title}</h1>
          </div>
          <div className="health-strip" aria-label="模块状态">
            <span className="health ok">训练可用</span>
            <span className="health ok">记录可用</span>
            <span className="health warn">image2 可降级</span>
            <span className="health warn">财务局部隔离</span>
          </div>
        </header>

        {activePage === "today" ? <TodayPage /> : null}
        {activePage === "profile" ? <ProfilePage /> : null}
        {activePage === "schedule" ? <SchedulePage /> : null}
        {activePage === "training" ? <TrainingPage /> : null}
        {activePage === "records" ? <RecordsPage /> : null}
        {activePage === "rewards" ? <RewardsPage /> : null}
        {activePage === "finance" ? <FinancePage /> : null}
        {activePage === "assets" ? <AssetsPage /> : null}
        {activePage === "stats" ? <StatsPage /> : null}
      </main>
    </div>
  );
}
