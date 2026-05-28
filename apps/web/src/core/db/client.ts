import Dexie, { type Table } from "dexie";
import type { CheckIn, ExerciseImageAsset, ExpenseLog } from "@ailifeos/schemas";

export class AiLifeOSDatabase extends Dexie {
  checkIns!: Table<CheckIn, string>;
  expenses!: Table<ExpenseLog, string>;
  imageAssets!: Table<ExerciseImageAsset, string>;

  constructor() {
    super("AiLifeOS");

    this.version(2).stores({
      checkIns: "id, date, type, sourceModule, createdAt",
      expenses: "id, date, category, source, relatedWishItemId, relatedGoalId",
      imageAssets: "assetId, exerciseId, status, promptHash, createdAt"
    });
  }
}

export const db = new AiLifeOSDatabase();
