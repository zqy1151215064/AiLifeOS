import { ShieldCheck, Target, Trophy } from "lucide-react";

export function ProfilePage() {
  return (
    <section className="module-section page-grid grid-3" aria-label="个人档案">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>半年目标</h2>
            <p>先完成前 4 周适应期，动作质量优先。</p>
          </div>
          <Target size={20} aria-hidden="true" />
        </div>
        <ul className="list">
          <li><strong>当前阶段</strong><span>第 1-4 周 · 适应期</span></li>
          <li><strong>主目标</strong><span>提升羽毛球、网球移动和稳定性</span></li>
          <li><strong>训练策略</strong><span>保守加量，先学动作</span></li>
        </ul>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>运动背景</h2>
            <p>球类活动会进入计划计算，不当作普通备注。</p>
          </div>
          <Trophy size={20} aria-hidden="true" />
        </div>
        <ul className="list">
          <li><strong>羽毛球</strong><span>关注启动、制动、肩肘保护</span></li>
          <li><strong>网球</strong><span>关注核心旋转、肩袖和髋部发力</span></li>
          <li><strong>健身经验</strong><span>新手，需要图文动作教学</span></li>
        </ul>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>安全边界</h2>
            <p>疼痛和疲劳优先于完成率。</p>
          </div>
          <ShieldCheck size={20} aria-hidden="true" />
        </div>
        <ul className="list">
          <li><strong>尖锐疼痛</strong><span>立即停止动作并记录</span></li>
          <li><strong>高疲劳</strong><span>降级为恢复或短训练</span></li>
          <li><strong>球类日</strong><span>不安排重腿和高负荷肩部训练</span></li>
        </ul>
      </div>
    </section>
  );
}
