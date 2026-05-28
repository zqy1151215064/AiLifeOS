import type { ExerciseImageAsset } from "@ailifeos/schemas";
import { db } from "../db/client";

export interface GenerateExerciseImageInput {
  exerciseId: string;
  prompt: string;
  version?: string;
}

export async function generateExerciseImage(
  input: GenerateExerciseImageInput
): Promise<ExerciseImageAsset> {
  const response = await fetch("/api/image2/exercise-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message ?? "图片生成失败");
  }

  const result = (await response.json()) as {
    assetId: string;
    status: "ready";
    imageUrl: string;
    promptHash: string;
    createdAt: string;
  };

  const asset: ExerciseImageAsset = {
    assetId: result.assetId,
    exerciseId: input.exerciseId,
    imageUrl: result.imageUrl,
    prompt: input.prompt,
    promptHash: result.promptHash,
    status: result.status,
    createdAt: result.createdAt
  };

  await db.imageAssets.put(asset);
  return asset;
}

