import { ImagePlus, RefreshCw, Server } from "lucide-react";
import { useMemo, useState } from "react";
import { generateExerciseImage } from "../core/assets/imageAssets";
import { db } from "../core/db/client";
import { buildExerciseImagePrompt, exerciseLibrary } from "../modules/training/data";
import { useLiveQuery } from "../shared/useLiveQuery";

export function AssetsPage() {
  const [selectedExerciseId, setSelectedExerciseId] = useState(exerciseLibrary[0].id);
  const [status, setStatus] = useState("选择动作后可按需生成教学图。");
  const assets = useLiveQuery(() => db.imageAssets.toArray(), []);
  const selectedExercise = useMemo(
    () => exerciseLibrary.find((exercise) => exercise.id === selectedExerciseId) ?? exerciseLibrary[0],
    [selectedExerciseId]
  );
  const prompt = buildExerciseImagePrompt(selectedExercise);
  const cachedAsset = [...assets]
    .filter((asset) => asset.exerciseId === selectedExercise.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  async function handleGenerate() {
    setStatus("请求 Go 本地服务中。若未配置 image2，会安全失败并保留 prompt。");
    try {
      const asset = await generateExerciseImage({
        exerciseId: selectedExercise.id,
        prompt,
        version: "v1"
      });
      setStatus(`已生成并缓存：${asset.assetId}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "图片生成失败");
    }
  }

  return (
    <section className="module-section page-grid grid-2" aria-label="资源模块">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>image2 资源</h2>
            <p>前端只请求 Go 服务，key 不进入浏览器。</p>
          </div>
          <Server size={20} aria-hidden="true" />
        </div>

        <label className="field">
          <span>选择动作</span>
          <select onChange={(event) => setSelectedExerciseId(event.target.value)} value={selectedExerciseId}>
            {exerciseLibrary.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
            ))}
          </select>
        </label>

        <div className="asset-preview">
          {cachedAsset?.imageUrl ? (
            <img alt={`${selectedExercise.name} 教学图`} src={cachedAsset.imageUrl} />
          ) : (
            <div className="empty-asset">
              <ImagePlus size={32} aria-hidden="true" />
              <span>暂无缓存图片</span>
            </div>
          )}
        </div>

        <p className="status-line">{status}</p>
        <div className="button-row">
          <button className="primary-button" type="button" onClick={() => void handleGenerate()}>
            <ImagePlus size={17} aria-hidden="true" />
            生成或复用动作图
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>资产 Manifest</h2>
            <p>Dexie 保存路径、prompt、状态和版本信息。</p>
          </div>
          <RefreshCw size={20} aria-hidden="true" />
        </div>
        <p className="prompt-preview">{prompt}</p>
        <ul className="list asset-list">
          {assets.length === 0 ? (
            <li><strong>暂无资产</strong><span>生成成功后会出现在这里。</span></li>
          ) : (
            assets.map((asset) => (
              <li key={asset.assetId}>
                <div>
                  <strong>{asset.exerciseId}</strong>
                  <span>{asset.status} · {asset.promptHash}</span>
                </div>
                <span className="pill">{asset.imageUrl ? "ready" : "missing"}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
