import type { DailyPlan, Exercise, PlanMode, ScheduleEvent, WishItem } from "@ailifeos/schemas";

export const exerciseLibrary: Exercise[] = [
  {
    id: "goblet-squat",
    name: "杯式深蹲",
    level: "beginner",
    equipment: "哑铃或壶铃",
    targetAreas: ["股四头肌", "臀部", "核心稳定"],
    sets: "3 组 x 8-10 次",
    steps: [
      "双脚与肩同宽，脚尖略微外展，双手抱住哑铃靠近胸口。",
      "吸气后屈髋屈膝下蹲，膝盖方向跟脚尖一致。",
      "下降到能保持腰背稳定的位置，呼气站起。"
    ],
    cues: ["胸口保持打开", "膝盖不要内扣", "脚掌三点稳定踩地"],
    commonMistakes: ["弯腰塌背", "膝盖内扣", "为了蹲更深而失去控制"],
    stopSignals: ["膝关节尖锐疼痛", "腰部刺痛", "动作明显变形"],
    alternatives: ["箱式深蹲", "徒手深蹲"],
    badmintonBenefit: "提升启动、急停和低重心移动能力。",
    tennisBenefit: "提升底线移动和击球前稳定支撑。"
  },
  {
    id: "romanian-deadlift",
    name: "罗马尼亚硬拉",
    level: "beginner",
    equipment: "哑铃",
    targetAreas: ["腘绳肌", "臀部", "髋铰链"],
    sets: "3 组 x 8 次",
    steps: [
      "双手持哑铃站立，膝盖微屈。",
      "臀部向后推，哑铃沿大腿前侧下降。",
      "感到大腿后侧被拉长后，用臀腿发力回到站立。"
    ],
    cues: ["背部保持中立", "动作像关车门一样向后推髋", "哑铃贴近身体"],
    commonMistakes: ["把动作做成深蹲", "背部弯曲", "下放过深"],
    stopSignals: ["下背部刺痛", "腿后侧拉扯痛超过可控范围"],
    alternatives: ["臀桥", "弹力带髋铰链"],
    badmintonBenefit: "改善后场起跳、落地和变向时的后链控制。",
    tennisBenefit: "提升击球前制动和髋部发力能力。"
  },
  {
    id: "seated-row",
    name: "坐姿划船",
    level: "beginner",
    equipment: "坐姿划船器",
    targetAreas: ["背阔肌", "菱形肌", "肩胛控制"],
    sets: "3 组 x 10-12 次",
    steps: [
      "坐稳后握住把手，背部直立，肩膀放松。",
      "先让肩胛向后向下，再把把手拉向身体。",
      "慢慢还原，保持身体不后仰借力。"
    ],
    cues: ["先动肩胛再拉手", "肩膀远离耳朵", "肘部沿身体两侧后拉"],
    commonMistakes: ["耸肩", "身体大幅后仰", "只用手臂拉"],
    stopSignals: ["肩前侧刺痛", "手臂麻木"],
    alternatives: ["弹力带划船", "胸托划船"],
    badmintonBenefit: "帮助肩胛稳定，降低反复挥拍后的肩部压力。",
    tennisBenefit: "提升上肢拉力平衡，保护发球和正反手击球。"
  },
  {
    id: "band-external-rotation",
    name: "弹力带肩袖外旋",
    level: "beginner",
    equipment: "弹力带",
    targetAreas: ["肩袖", "肩关节稳定"],
    sets: "2 组 x 12-15 次",
    steps: [
      "肘部夹在身体侧面，前臂与地面平行。",
      "保持肘部不离开身体，向外旋转前臂。",
      "慢慢回到起始位置，保持全程可控。"
    ],
    cues: ["重量宁轻勿重", "肘部固定", "不要耸肩"],
    commonMistakes: ["手臂甩动", "身体跟着旋转", "弹力过大导致动作变形"],
    stopSignals: ["肩关节深处疼痛", "手臂麻木"],
    alternatives: ["无负重外旋", "侧卧外旋"],
    badmintonBenefit: "提升扣杀、吊球后的肩部耐受。",
    tennisBenefit: "保护发球和高位击球时的肩袖。"
  },
  {
    id: "dead-bug",
    name: "死虫核心",
    level: "beginner",
    equipment: "瑜伽垫",
    targetAreas: ["核心稳定", "抗伸展"],
    sets: "3 组 x 每侧 6-8 次",
    steps: [
      "仰卧，手臂指向天花板，髋膝弯曲到 90 度。",
      "保持腰背轻贴地面，缓慢伸出对侧手脚。",
      "回到起始位置后换边，动作越慢越好。"
    ],
    cues: ["腰不要拱起", "呼吸保持稳定", "动作慢于直觉"],
    commonMistakes: ["腰背离地", "动作过快", "只追求次数"],
    stopSignals: ["腰部疼痛", "无法控制腰背位置"],
    alternatives: ["单腿死虫", "平板支撑"],
    badmintonBenefit: "提升变向和起跳落地时的躯干控制。",
    tennisBenefit: "提升旋转击球时的身体稳定。"
  }
];

const sharedNutrition = [
  {
    id: "breakfast",
    title: "早餐",
    detail: "蛋白质 + 主食 + 水果，先保证稳定能量。",
    tag: "基础"
  },
  {
    id: "post-training",
    title: "训练后",
    detail: "30-90 分钟内补水，安排蛋白质和适量碳水。",
    tag: "恢复"
  },
  {
    id: "dinner",
    title: "晚餐",
    detail: "正常吃饭，优先蛋白质、蔬菜和易消化主食。",
    tag: "收尾"
  }
];

export const dailyPlans: Record<PlanMode, DailyPlan> = {
  standard: {
    mode: "standard",
    title: "下肢基础 + 核心稳定",
    summary: "适合没有高强度球类安排、疲劳较低的普通训练日。",
    reason: "今天优先建立下肢力量和核心控制，为羽毛球、网球的启动、制动和变向打基础。",
    loadLabel: "45 分钟 · 中等强度",
    training: [
      { id: "warmup", title: "热身", detail: "椭圆机或快走 6 分钟，随后做髋部动态活动。", tag: "6 分钟" },
      { id: "squat", title: "杯式深蹲", detail: "3 组 x 8-10 次，最后 2 次吃力但动作不变形。", tag: "主项" },
      { id: "rdl", title: "罗马尼亚硬拉", detail: "3 组 x 8 次，学习髋铰链，不追求重量。", tag: "后链" },
      { id: "dead-bug", title: "死虫核心", detail: "3 组 x 每侧 6-8 次，慢速完成。", tag: "核心" }
    ],
    stretch: [
      { id: "hip-flexor", title: "髋屈肌拉伸", detail: "每侧 45 秒，保持骨盆中立。", tag: "2 分钟" },
      { id: "hamstring", title: "腘绳肌放松", detail: "每侧 45 秒，避免弹振。", tag: "2 分钟" },
      { id: "calf", title: "小腿拉伸", detail: "每侧 45 秒，为球类移动做恢复。", tag: "2 分钟" },
      { id: "breathing", title: "仰卧呼吸", detail: "2 分钟，降低训练后兴奋度。", tag: "2 分钟" }
    ],
    nutrition: sharedNutrition,
    riskNotes: ["动作变形时不要加重量。", "如果膝盖或腰部出现尖锐疼痛，停止主项并改恢复。"]
  },
  short: {
    mode: "short",
    title: "20 分钟保底训练",
    summary: "适合加班、时间不足但仍想保留训练节奏的日子。",
    reason: "今天目标不是刷训练量，而是保住动作学习和执行连续性。",
    loadLabel: "20 分钟 · 低到中等强度",
    training: [
      { id: "warmup", title: "快速热身", detail: "快走 4 分钟 + 肩髋活动。", tag: "4 分钟" },
      { id: "squat", title: "杯式深蹲", detail: "2 组 x 8 次，动作质量优先。", tag: "保底" },
      { id: "row", title: "坐姿划船", detail: "2 组 x 10 次，肩膀不要耸。", tag: "平衡" },
      { id: "dead-bug", title: "死虫核心", detail: "2 组 x 每侧 6 次。", tag: "核心" }
    ],
    stretch: [
      { id: "hip-flexor", title: "髋屈肌拉伸", detail: "每侧 30 秒。", tag: "1 分钟" },
      { id: "chest", title: "胸椎打开", detail: "靠墙或泡沫轴 60 秒。", tag: "1 分钟" },
      { id: "breathing", title: "呼吸收尾", detail: "1 分钟，确认没有疼痛。", tag: "1 分钟" }
    ],
    nutrition: [
      { id: "pre-training", title: "训练前", detail: "如果空腹，吃香蕉或面包等易消化碳水。", tag: "轻量" },
      ...sharedNutrition.slice(1)
    ],
    riskNotes: ["时间短时不要压缩热身。", "宁可少做一组，也不要赶动作。"]
  },
  sport: {
    mode: "sport",
    title: "球类日降级方案",
    summary: "适合晚上有羽毛球、网球或网球课的日子。",
    reason: "球类活动本身就是训练负荷，力量训练只做激活和关节稳定。",
    loadLabel: "25 分钟 · 低强度",
    training: [
      { id: "warmup", title: "全身激活", detail: "快走 5 分钟 + 肩髋动态活动。", tag: "激活" },
      { id: "external-rotation", title: "肩袖外旋", detail: "2 组 x 12 次，弹力带用轻阻力。", tag: "肩部" },
      { id: "dead-bug", title: "死虫核心", detail: "2 组 x 每侧 6 次。", tag: "核心" },
      { id: "mobility", title: "髋踝灵活性", detail: "每个动作 45 秒，给晚上的移动做准备。", tag: "准备" }
    ],
    stretch: [
      { id: "shoulder", title: "肩后侧放松", detail: "每侧 45 秒，避免压痛。", tag: "肩" },
      { id: "calf", title: "小腿拉伸", detail: "每侧 45 秒。", tag: "移动" },
      { id: "forearm", title: "前臂放松", detail: "每侧 45 秒，给握拍恢复。", tag: "握拍" }
    ],
    nutrition: [
      { id: "pre-sport", title: "打球前", detail: "提前 60-90 分钟补充易消化碳水和水。", tag: "补给" },
      { id: "during-sport", title: "打球中", detail: "每 15-20 分钟少量喝水，出汗多时补电解质。", tag: "水分" },
      { id: "after-sport", title: "打球后", detail: "晚餐保证蛋白质，不用额外大吃。", tag: "恢复" }
    ],
    riskNotes: ["当天不安排重腿。", "肩痛时取消上肢高负荷动作。"]
  },
  recovery: {
    mode: "recovery",
    title: "恢复与拉伸日",
    summary: "适合疲劳高、酸痛明显或身体状态一般的日子。",
    reason: "恢复日不是失败，而是为了让后续训练和打球更稳定。",
    loadLabel: "18 分钟 · 恢复",
    training: [
      { id: "walk", title: "轻松走路", detail: "10 分钟，能完整说话的强度。", tag: "恢复" },
      { id: "mobility", title: "髋、胸椎、踝活动", detail: "每个动作 45 秒，不追求幅度。", tag: "灵活性" }
    ],
    stretch: [
      { id: "hips", title: "髋部放松", detail: "左右各 60 秒。", tag: "髋" },
      { id: "back", title: "猫牛式", detail: "8-10 次，缓慢呼吸。", tag: "背" },
      { id: "breathing", title: "呼吸恢复", detail: "3 分钟，降低疲劳感。", tag: "收尾" }
    ],
    nutrition: [
      { id: "regular", title: "正常三餐", detail: "不要因为没训练就过度少吃，保证蛋白质。", tag: "稳定" },
      { id: "water", title: "饮水", detail: "分散饮水，观察尿色和口渴程度。", tag: "恢复" }
    ],
    riskNotes: ["疲劳连续两天高于 7 分时，下次训练继续降级。", "疼痛优先记录，不硬练。"]
  },
  skip: {
    mode: "skip",
    title: "计划变化记录",
    summary: "适合今天明确不练，但仍需要给系统留下原因。",
    reason: "跳过也可以是有效输入，系统需要知道是疲劳、时间、情绪还是日程冲突。",
    loadLabel: "3 分钟 · 记录",
    training: [
      { id: "reason", title: "记录原因", detail: "选择今天不练的主要原因，给后续计划重排使用。", tag: "必要" },
      { id: "minimum", title: "最低恢复", detail: "睡前 3 分钟肩颈、髋部或小腿放松。", tag: "可选" }
    ],
    stretch: [
      { id: "easy", title: "轻量拉伸", detail: "选择最紧张的部位做 2-3 分钟。", tag: "低摩擦" }
    ],
    nutrition: [
      { id: "regular", title: "正常饮食", detail: "取消训练前后补给，但不要省掉蛋白质。", tag: "同步调整" }
    ],
    riskNotes: ["跳过不是失败，但连续跳过需要在周复盘里调整计划。"]
  }
};

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: "weekly-wed-badminton",
    title: "每周三下班后羽毛球",
    type: "badminton",
    weekday: 3,
    timeLabel: "周三 19:30",
    intensity: "medium",
    notes: "当天不安排重腿，优先肩袖、核心和恢复。"
  },
  {
    id: "temporary-tennis-class",
    title: "临时网球课",
    type: "tennis",
    date: "按当天添加",
    timeLabel: "晚上",
    intensity: "high",
    notes: "作为高强度运动负荷，训练计划自动降级。"
  }
];

export const wishItems: WishItem[] = [
  {
    id: "racket-shoes",
    title: "买一双适合球类移动的训练鞋",
    cost: 699,
    category: "equipment",
    priority: "high",
    fundSaved: 120
  },
  {
    id: "weekend-trip",
    title: "周末短途旅行",
    cost: 1800,
    category: "travel",
    priority: "medium",
    fundSaved: 300
  },
  {
    id: "tennis-course",
    title: "追加 1 节网球私教课",
    cost: 360,
    category: "course",
    priority: "high",
    fundSaved: 0
  }
];

export function getSuggestedMode(input: {
  fatigue: number;
  painLevel: number;
  availableMinutes: number;
  hasSportToday: boolean;
}): PlanMode {
  if (input.painLevel >= 4 || input.fatigue >= 8) {
    return "recovery";
  }
  if (input.availableMinutes <= 20) {
    return "short";
  }
  if (input.hasSportToday) {
    return "sport";
  }
  return "standard";
}

export function buildExerciseImagePrompt(exercise: Exercise): string {
  return [
    `Instructional fitness illustration for beginner ${exercise.name}.`,
    `Exercise equipment: ${exercise.equipment}.`,
    `Target areas: ${exercise.targetAreas.join(", ")}.`,
    `Show safe start posture and controlled movement process, realistic human proportions.`,
    `Clean white background, sports rehabilitation teaching style, no text labels, no exaggerated muscles.`,
    `Important cues: ${exercise.cues.join("; ")}.`,
    `Avoid showing these mistakes: ${exercise.commonMistakes.join("; ")}.`
  ].join(" ");
}
