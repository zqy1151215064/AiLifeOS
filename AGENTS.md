# AiLifeOS Project Instructions

## 必读记忆

每次开始开发、设计页面、调整功能或生成代码前，必须先阅读：

- [docs/product-memory.html](docs/product-memory.html)
- [docs/requirements/v1-mvp-master-plan.html](docs/requirements/v1-mvp-master-plan.html)

这份 HTML 文档是 AiLifeOS 当前阶段的权威产品记忆，记录产品定位、模块边界、训练与饮食一体化流程、image2 动作图生成链路、页面设计原则和暂不实现范围。

`docs/requirements/v1-mvp-master-plan.html` 是 V1 MVP 的总控交付文档，记录从用户场景到需求、功能点、技术方案和工程任务的转换结果。后续编码必须先确认任务属于该文档中的范围、优先级和里程碑。

`docs/product-memory.md` 仅作为历史草稿保留。如 HTML 与 Markdown 内容不一致，以 HTML 为准。

涉及运动训练与饮食一体化模块的需求分析、页面设计、数据建模和开发实现，还必须阅读：

- [docs/requirements/training-nutrition-prd.html](docs/requirements/training-nutrition-prd.html)

这份 PRD 是该模块的产品需求基线，用于把场景转成可落地功能、规则和验收标准。

涉及愿望清单、集卡、盲盒、奖励兑换或跨模块激励体系，还必须阅读：

- [docs/requirements/reward-wishlist-system-prd.html](docs/requirements/reward-wishlist-system-prd.html)

这份 PRD 是 AiLifeOS 跨模块激励系统的产品需求基线。训练、学习等模块只产出有效打卡和目标进度事件，激励系统统一负责发卡、集卡、盲盒、心愿清单和兑换规则。

涉及预算、心愿兑换预算判断、预支、储蓄计划、消费记录、财务状态，或任何模块中的付费决策，还必须阅读：

- [docs/requirements/finance-budget-system-prd.html](docs/requirements/finance-budget-system-prd.html)

这份 PRD 是 AiLifeOS Core 财务模块的产品需求基线。愿望激励、学习、健康、训练、旅行等模块不能独立决定消费，必须通过 `core/finance` 做预算检查、预支检查和兑换确认。

## 当前阶段重点

当前开发 AiLifeOS V1 MVP：以运动训练与饮食一体化为首个业务场景，同时接入打卡、愿望激励、Core 财务和手动开销，跑通第一个完整闭环。

不要把它做成独立健身 App。训练饮食只是 V1 的首个场景，愿望激励和 Core 财务是跨模块基础能力，必须复用未来可扩展的核心对象：个人档案、目标、计划、任务、日程、记录、资源、复盘、规则、奖励和财务状态。

## 开发原则

- 先满足个人使用场景，避免过度产品化。
- V1 前端固定使用 React + TypeScript + Vite。
- 仓库采用 monorepo 思路组织，前端、Go 服务、共享类型和文档在同一仓库内分包管理。
- 模块必须支持故障隔离。某个模块失败时应局部降级，不应导致其他模块不可用；例如 Core 财务异常时，训练、打卡和动作资源仍应可用。
- 优先实现训练、饮食、打卡、激励、财务预算和手动开销的 V1 闭环。
- 不做用户系统、数据库、社区、排行榜、支付等非当前必需功能。
- V1 不接入支付宝、微信、淘宝、美团、银行等外部账单自动同步，只预留来源字段。
- 如需后端服务，优先使用 Go。image2 代理、图片落盘、后续账单导入和本地 API 服务都应优先按 Go 后端设计，不默认使用 Node/Express。
- image2 key 只能放在本地环境变量或本地服务中，不能写入前端代码，不能提交到 GitHub。
- 生成的动作图片可以作为静态资源保存到仓库，但必须保留可复用、可审核、可重生成的资产状态。
- 修改产品方向、模块边界或关键流程时，同步更新 `docs/product-memory.html`。

## 输出语言

面向用户的说明、文档和注释优先使用简体中文，保持专业、简洁、工程化。
