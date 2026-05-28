export type CheckInType =
  | "status"
  | "training"
  | "stretch"
  | "nutrition"
  | "sport"
  | "plan_change"
  | "pain";

export type FinanceDecisionResult =
  | "allow"
  | "caution"
  | "delay"
  | "fund"
  | "advance_required"
  | "blocked";

export interface CheckIn {
  id: string;
  type: CheckInType;
  date: string;
  sourceModule: "training";
  createdAt: string;
  fatigue?: number;
  painLevel?: number;
  availableMinutes?: number;
  completionRate?: number;
  reason?: string;
  notes?: string;
  validForReward?: boolean;
}

export interface ExpenseLog {
  id: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod?: string;
  source: "manual" | "alipay" | "taobao" | "meituan" | "bank" | "wechat" | "other";
  relatedWishItemId?: string;
  relatedGoalId?: string;
  notes?: string;
}

export interface FinanceDecision {
  id: string;
  sourceModule: string;
  targetType: "wish" | "course" | "equipment" | "subscription" | "travel" | "other";
  targetId?: string;
  amount: number;
  result: FinanceDecisionResult;
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
  createdAt: string;
}

export interface ExerciseImageAsset {
  assetId: string;
  exerciseId: string;
  imageUrl?: string;
  prompt: string;
  promptHash: string;
  status: "missing" | "generating" | "ready" | "rejected" | "regenerate" | "failed";
  createdAt: string;
}

export type PlanMode = "standard" | "short" | "sport" | "recovery" | "skip";

export interface Exercise {
  id: string;
  name: string;
  level: "beginner" | "intermediate";
  equipment: string;
  targetAreas: string[];
  sets: string;
  steps: string[];
  cues: string[];
  commonMistakes: string[];
  stopSignals: string[];
  alternatives: string[];
  badmintonBenefit: string;
  tennisBenefit: string;
}

export interface DailyPlanItem {
  id: string;
  title: string;
  detail: string;
  tag: string;
}

export interface DailyPlan {
  mode: PlanMode;
  title: string;
  summary: string;
  reason: string;
  loadLabel: string;
  training: DailyPlanItem[];
  stretch: DailyPlanItem[];
  nutrition: DailyPlanItem[];
  riskNotes: string[];
}

export interface ScheduleEvent {
  id: string;
  title: string;
  type: "badminton" | "tennis" | "gym" | "recovery" | "other";
  weekday?: number;
  date?: string;
  timeLabel: string;
  intensity: "low" | "medium" | "high";
  notes: string;
}

export interface WishItem {
  id: string;
  title: string;
  cost: number;
  category: "equipment" | "travel" | "course" | "experience" | "other";
  priority: "low" | "medium" | "high";
  fundSaved: number;
}
