/**
 * Site content — grounded in the real ax/ and axcrew/ repositories
 * (docs/, release notes, git history). Keep claims to what the
 * projects actually implement. All UI-facing text is bilingual (B).
 */

import { b, type B } from './i18n';

export interface ChangelogEntry {
  version: string;
  product: 'AX' | 'AXCrew';
  entries: B[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '0.3.7',
    product: 'AX',
    entries: [
      b('Optional distributed ACP worker and collaboration Tool', '可选的分布式 ACP Worker 与 collaboration 工具'),
      b('Isolated attempt workspaces, Artifact exchange and checkpoint recovery', '隔离执行工作区、Artifact 交换与检查点恢复'),
      b('Durable async collaboration without a permanent Coordinator Agent', '持久化异步协作，无需持续存活的 Coordinator Agent'),
    ],
  },
  {
    version: '0.3.3',
    product: 'AXCrew',
    entries: [
      b('Distributed control plane: capability plus shared Host-resource scheduling', '分布式控制层：AX 能力与 Host 共享资源联合调度'),
      b('Durable Tasks, Events, Artifacts and Workflow State with fenced recovery', 'Durable Task、Event、Artifact 与 Workflow State，带执行代次隔离和恢复'),
      b('Dedicated Distributed management page in the desktop sidebar', '桌面侧边栏新增分布式协作管理页'),
    ],
  },
  {
    version: '0.3.3',
    product: 'AX',
    entries: [
      b('Evolution: append-only experiences.jsonl with a versioned ledger', '演化：追加式 experiences.jsonl，带版本化账本'),
      b('Persisted byte cursors · bounded batches · restart-safe migration', '持久化字节游标 · 有界批次 · 重启安全迁移'),
      b('518 tests passing · clippy clean', '518 项测试通过 · clippy 无告警'),
    ],
  },
  {
    version: '0.3.2',
    product: 'AX',
    entries: [b('Frontend child parity', '前端子任务对等'), b('Explicit task inputs', '显式任务输入')],
  },
  {
    version: '0.3.1',
    product: 'AX',
    entries: [b('Long-task execution liveness fix', '修复长任务执行活性问题')],
  },
  {
    version: '0.3.0',
    product: 'AX',
    entries: [b('Agent hardening · parallel children', '代理加固 · 并行子任务')],
  },
  {
    version: '0.2.10',
    product: 'AX',
    entries: [b('Workspace runtime sandbox', '工作区运行时沙箱'), b('Model-directed policies', '模型导向的策略')],
  },
  {
    version: '0.2.9',
    product: 'AX',
    entries: [b('Disposable child workspaces', '可销毁的子工作区'), b('Execution settings', '执行设置')],
  },
  {
    version: '0.2.8',
    product: 'AX',
    entries: [b('Automatic isolated child execution', '自动隔离的子任务执行')],
  },
  {
    version: '0.2.7',
    product: 'AX',
    entries: [b('Goal-scoped task queue lifecycle fixes', '目标作用域任务队列生命周期修复')],
  },
  {
    version: '0.2.6',
    product: 'AX',
    entries: [b('Durable task queues', '持久化任务队列'), b('Installation-owned storage', '安装归属的存储')],
  },
  {
    version: '0.3.0',
    product: 'AXCrew',
    entries: [
      b('Updater retry + GitCode release mirror', '更新器重试 + GitCode 发布镜像'),
      b('Windows installer rename/restore under Restart Manager', 'Windows 安装器在 Restart Manager 下重命名/恢复'),
      b('apps/ + crates/ product monorepo', 'apps/ + crates/ 产品单体仓库'),
    ],
  },
  {
    version: '0.2.9',
    product: 'AXCrew',
    entries: [b('Subagent controls', '子代理控制'), b('Installer fixes', '安装器修复')],
  },
  {
    version: '0.2.8',
    product: 'AXCrew',
    entries: [b('Agent environment settings', '代理环境设置'), b('Terminal settings', '终端设置')],
  },
  {
    version: '0.2.7',
    product: 'AXCrew',
    entries: [b('Adaptive composers', '自适应合成器'), b('Capability imports', '能力导入')],
  },
  {
    version: '0.2.6',
    product: 'AXCrew',
    entries: [b('Conversation actions', '会话操作'), b('Changes panels', '变更面板')],
  },
  {
    version: '0.2.5',
    product: 'AXCrew',
    entries: [b('Compact tool cards', '紧凑工具卡片'), b('Reliable status replay', '可靠的状态回放')],
  },
  {
    version: '0.2.4',
    product: 'AXCrew',
    entries: [b('Fixed locked backend during updates', '修复更新期间后端被锁定的问题')],
  },
  {
    version: '0.2.3',
    product: 'AXCrew',
    entries: [b('Usage statistics', '使用统计'), b('Permanent session deletion', '会话永久删除')],
  },
  {
    version: '0.2.2',
    product: 'AXCrew',
    entries: [b('Fast toggle', '快速开关'), b('Desktop fixes', '桌面端修复')],
  },
];

export interface DocSection {
  id: string;
  title: B;
  body: B;
  code?: string;
}

export const DOCS_SECTIONS: DocSection[] = [
  {
    id: 'overview',
    title: b('Overview', '概览'),
    body: b(
      'AX is an agent runtime kernel — not a chat personality layer. One model → tool → model loop, checkpointed sessions, and a narrow contract for capabilities. AXCrew is the control plane that schedules work across AX devices and streams what happens, without touching agent state.',
      'AX 是一个代理运行时内核——不是聊天人格层。模型 → 工具 → 模型的单一循环、可断点续传的会话，以及窄而明确的能力契约。AXCrew 是控制平面：在多个 AX 设备之间调度任务、实时流式输出过程，但不触碰代理状态。',
    ),
  },
  {
    id: 'install',
    title: b('Install', '安装'),
    body: b(
      'One command, verified against SHA256SUMS. The release archive ships an example MCP config; nothing is connected until you ask.',
      '一条命令，按 SHA256SUMS 校验。发布包附带一个 MCP 配置示例；在你主动要求之前，不会连接任何东西。',
    ),
    code: '$ curl -fsSL https://axium.dev/install.sh | sh',
  },
  {
    id: 'runtime',
    title: b('Runtime', '运行时'),
    body: b(
      'The kernel owns context selection by token budget (never fixed message counts), capacity-aware compaction, checkpointed tool rounds, and a dependency DAG that runs ready independent calls with bounded concurrency (default 4, cap 64). Long tasks run in the same loop — there is no separate planner.',
      '内核按 token 预算选择上下文（绝不固定消息数量）、容量感知压缩、可断点续传的工具轮次，以及依赖 DAG——就绪的独立调用以有界并发执行（默认 4，上限 64）。长任务也跑在同一条循环里——不存在单独的规划器。',
    ),
  },
  {
    id: 'tools',
    title: b('Tools & permissions', '工具与权限'),
    body: b(
      'Built-ins: shell, filesystem, find_files/glob, patch, search, web, view_image. Every tool declares its own permission — allow / ask / deny per capability — through one PermissionStore shared by UI and runtime. Shell and unknown-effect tools hold an exclusive lease; read-only tools declare effects and run concurrently.',
      '内置工具：shell、filesystem、find_files/glob、patch、search、web、view_image。每个工具都声明自己的权限——按能力 allow / ask / deny——经由 UI 与运行时共享的同一个 PermissionStore。shell 和未知影响工具持有独占租约；只读工具声明影响后可并发运行。',
    ),
    code: '$ ax run "find the failing test and fix it"',
  },
  {
    id: 'skills',
    title: b('Skills', '技能'),
    body: b(
      'Skills are SKILL.md packages in $AX_HOME/skills or <project>/.ax/skills. Routing is lexical and language-independent; bodies and resources load only when a route hits. Enable/disable is deterministic, scoped, and never needs a model call.',
      '技能是放在 $AX_HOME/skills 或 <project>/.ax/skills 下的 SKILL.md 包。路由按词法进行、与语言无关；命中路由才加载正文与资源。启用/禁用是确定性的、作用域化的，且永远不需要一次模型调用。',
    ),
  },
  {
    id: 'mcp',
    title: b('MCP', 'MCP'),
    body: b(
      'AX implements stdio, Streamable HTTP and WebSocket transports. Servers stay dormant until a proxy tool is invoked; the capability catalog is visible without connecting. Remote tools become ordinary tools named mcp__server__tool.',
      'AX 实现 stdio、Streamable HTTP 与 WebSocket 三种传输。服务器在被代理工具调用前保持休眠；无需连接即可查看能力目录。远端工具变成名为 mcp__server__tool 的普通工具。',
    ),
    code: '$ ax mcp tools <server>',
  },
  {
    id: 'memory',
    title: b('Memory', '记忆'),
    body: b(
      'Three scopes — Global, Project, Session — in SQLite with append-only JSONL history. Retrieval filters by owner, recalls at most 32 candidates, reranks lightly and injects bounded summaries. No embeddings, no vector store, no extra model call. Every message and tool result is checkpointed before execution advances.',
      '三层作用域——全局、项目、会话——存于 SQLite，历史为追加式 JSONL。检索按归属者过滤、最多召回 32 个候选、轻度重排后注入有界摘要。无向量嵌入、无向量库、无额外模型调用。每次消息与工具结果都在执行推进前完成断点记录。',
    ),
  },
  {
    id: 'subagents',
    title: b('Subagents', '子代理'),
    body: b(
      'Delegation is available by default through subagent and subagent_fork. AXCrew’s Plugins → Agents page controls global/project depth and parallelism: 0 disables delegation, 1 permits direct children, and larger depths permit nested delegation. Children share a concurrency budget and permission ceiling; isolated children keep their own workspace, session and memory, while forked children share the parent workspace and completed conversation context.',
      '默认提供 subagent 与 subagent_fork 委派工具。AXCrew 的「插件 → 智能体」页可设置全局或项目的深度与并行上限：0 关闭，1 允许直接子智能体，更大的深度允许递归委派。各层共享并行名额与权限上限；隔离子任务拥有独立工作区、会话和记忆，fork 子任务共享父级工作区与已完成的对话上下文。',
    ),
  },
  {
    id: 'sandbox',
    title: b('Sandbox', '沙箱'),
    body: b(
      'File and terminal tools use the workspace sandbox; native OS confinement currently requires Linux. Application/site access and action approvals are separate. Host UI grants do not change the workspace boundary; Windows/macOS native sandbox backends remain unavailable.',
      '文件与终端工具遵循工作区沙箱；原生操作系统隔离目前需要 Linux。应用、网站访问与具体操作审批分别管理，主机界面授权不改变工作区边界。Windows/macOS 原生沙箱后端尚未实现。',
    ),
  },
  {
    id: 'providers',
    title: b('Providers', '模型提供方'),
    body: b(
      'Provider-neutral by design. DeepSeek, Groq, Mistral, OpenRouter, xAI, Kimi and other OpenAI-compatible endpoints via one shared adapter; OpenAI Responses; Codex device-flow OAuth; WorkBuddy account login. Add a local model by implementing ModelProvider — no loop changes.',
      '设计上中立。DeepSeek、Groq、Mistral、OpenRouter、xAI、Kimi 及其他 OpenAI 兼容端点走同一个共享适配器；OpenAI Responses；Codex 设备流 OAuth；WorkBuddy 账号登录。实现 ModelProvider 即可接入本地模型——主循环无需改动。',
    ),
    code: 'DEEPSEEK_API_KEY=… $ ax --provider deepseek --model deepseek-chat',
  },
  {
    id: 'evolution',
    title: b('Evolution', '演化'),
    body: b(
      'Low-frequency experience learning: bounded observations are analyzed in-process into owned skill lifecycles and project facts. History is append-only (experiences.jsonl); control lives in a versioned ledger.',
      '低频经验学习：有界的观察在进程内被分析，沉淀为归属的技能生命周期与项目事实。历史为追加式（experiences.jsonl）；控制权在版本化账本中。',
    ),
  },
  {
    id: 'acp',
    title: b('ACP adapter', 'ACP 适配器'),
    body: b(
      'ax acp speaks Agent Client Protocol v1 over stdio: initialize, session/new, load, resume, prompt, cancel, plus read-only _ax/status, _ax/models, _ax/tools, _ax/capabilities and scopedCapabilities. One JSON-RPC object per line; session IDs are AX UUIDs.',
      'ax acp 通过 stdio 讲 Agent Client Protocol v1：initialize、session/new、load、resume、prompt、cancel，以及只读的 _ax/status、_ax/models、_ax/tools、_ax/capabilities 与 scopedCapabilities。每行一个 JSON-RPC 对象；会话 ID 是 AX UUID。',
    ),
    code: '$ ax acp',
  },
  {
    id: 'crew',
    title: b('AXCrew', 'AXCrew'),
    body: b(
      'A Rust control plane with a desktop client and an Android control client. It schedules deterministic task DAGs across paired AX devices, maintains device identity and session bindings, brokers approvals, and streams live CrewEvent JSON. AX keeps history, memory, tools and credentials.',
      '一个 Rust 控制平面，带桌面客户端与 Android 控制客户端。它在已配对的 AX 设备之间调度确定性任务 DAG，维护设备身份与会话绑定，代理审批，并流式输出实时 CrewEvent JSON。历史、记忆、工具与凭据始终留在 AX 侧。',
    ),
    code: '$ axcrew up\n$ ax crew pair <code> --gateway https://crew.example.com',
  },
  {
    id: 'protocol',
    title: b('Protocol', '协议'),
    body: b(
      'Three stable contracts: the REST API and CrewEvent WebSocket envelope (event_id, kind, task_id, payload), the ACP JSON-RPC framing over the routed gateway, and the device handshake — a one-time pairing code, an Ed25519 challenge, heartbeats, and outbound WSS so no inbound port is ever needed.',
      '三个稳定契约：REST API 与 CrewEvent WebSocket 信封（event_id、kind、task_id、payload）；经路由网关的 ACP JSON-RPC 帧；设备握手——一次性配对码、Ed25519 挑战、心跳，以及出站 WSS，因此永远不需要入站端口。',
    ),
  },
  {
    id: 'cli',
    title: b('CLI reference', 'CLI 参考'),
    body: b(
      'Everything is reachable from one binary. Sessions resume across restarts; goals can be suspended, resumed, superseded or cancelled without losing checkpointed work.',
      '一切都可以从同一个二进制触达。会话跨重启恢复；目标可挂起、恢复、被取代或取消，且不丢失已断点的工作。',
    ),
  },
];
