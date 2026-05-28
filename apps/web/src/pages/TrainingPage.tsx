import { AlertTriangle, Dumbbell, ListChecks, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { buildExerciseImagePrompt, dailyPlans, exerciseLibrary } from "../modules/training/data";

export function TrainingPage() {
  const [selectedExerciseId, setSelectedExerciseId] = useState(exerciseLibrary[0].id);
  const selectedExercise = useMemo(
    () => exerciseLibrary.find((exercise) => exercise.id === selectedExerciseId) ?? exerciseLibrary[0],
    [selectedExerciseId]
  );
  const prompt = buildExerciseImagePrompt(selectedExercise);

  return (
    <section className="module-section page-grid grid-3" aria-label="训练模块">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>周任务池</h2>
            <p>不写死课表，每天根据日程和状态选择任务。</p>
          </div>
          <ListChecks size={20} aria-hidden="true" />
        </div>
        <ul className="list">
          <li><strong>下肢基础</strong><span>1 次 · 杯式深蹲 / 髋铰链</span></li>
          <li><strong>上肢稳定</strong><span>1 次 · 划船 / 肩袖外旋</span></li>
          <li><strong>核心抗旋转</strong><span>2 次 · 死虫 / 平板类</span></li>
          <li><strong>灵活性恢复</strong><span>2 次 · 肩髋踝和呼吸</span></li>
        </ul>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>动作库</h2>
            <p>动作定义是 image2 prompt 的结构化来源。</p>
          </div>
          <Dumbbell size={20} aria-hidden="true" />
        </div>
        <div className="exercise-list">
          {exerciseLibrary.map((exercise) => (
            <button
              className={exercise.id === selectedExercise.id ? "exercise-item active" : "exercise-item"}
              key={exercise.id}
              type="button"
              onClick={() => setSelectedExerciseId(exercise.id)}
            >
              <strong>{exercise.name}</strong>
              <span>{exercise.equipment} · {exercise.sets}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>安全规则</h2>
            <p>AI 可以解释规则，但不能绕过规则。</p>
          </div>
          <ShieldCheck size={20} aria-hidden="true" />
        </div>
        <ul className="list">
          <li><strong>尖锐疼痛</strong><span>停止动作，记录疼痛</span></li>
          <li><strong>当天网球课</strong><span>降低肩部高负荷，不做重腿</span></li>
          <li><strong>连续高疲劳</strong><span>降级恢复，减少训练量</span></li>
        </ul>
      </div>

      <div className="panel span-2">
        <div className="panel-header">
          <div>
            <h2>{selectedExercise.name}</h2>
            <p>{selectedExercise.badmintonBenefit} {selectedExercise.tennisBenefit}</p>
          </div>
          <span className="pill ok">{selectedExercise.level}</span>
        </div>
        <div className="detail-grid">
          <DetailBlock title="步骤" items={selectedExercise.steps} />
          <DetailBlock title="提示" items={selectedExercise.cues} />
          <DetailBlock title="常见错误" items={selectedExercise.commonMistakes} />
          <DetailBlock title="停止信号" items={selectedExercise.stopSignals} danger />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>动作图 Prompt</h2>
            <p>资源页会用同一套结构生成并缓存图片。</p>
          </div>
          <AlertTriangle size={20} aria-hidden="true" />
        </div>
        <p className="prompt-preview">{prompt}</p>
      </div>

      <div className="panel span-3">
        <div className="panel-header">
          <div>
            <h2>今日训练模板</h2>
            <p>标准、短训练、球类日、恢复日和跳过记录都已具备最小模板。</p>
          </div>
        </div>
        <div className="mode-grid">
          {Object.values(dailyPlans).map((plan) => (
            <div className="mode-card" key={plan.mode}>
              <strong>{plan.title}</strong>
              <span>{plan.loadLabel}</span>
              <p>{plan.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailBlock(props: { title: string; items: string[]; danger?: boolean }) {
  return (
    <div className={props.danger ? "detail-block danger-block" : "detail-block"}>
      <strong>{props.title}</strong>
      <ul>
        {props.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
