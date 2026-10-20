/**
 * Site content — grounded in the real ax/ and axcrew/ repositories.
 * Keep claims to what the projects actually implement.
 */

import { b, type B } from './i18n';

export interface ChangelogEntry {
  version: string;
  product: 'AX' | 'AXCrew';
  entries: B[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '0.3.11',
    product: 'AX',
    entries: [
      b('Native Windows UIA, Linux AT-SPI and macOS Accessibility desktop adapters', '原生 Windows UIA、Linux AT-SPI 与 macOS Accessibility 桌面适配器'),
      b('Unix terminal login shell selection (default/sh/bash/zsh/fish)', 'Unix 终端登录 shell 选择（default/sh/bash/zsh/fish）'),
      b('Windows, Linux and macOS release archives built by CI', '由 CI 构建的 Windows、Linux 与 macOS 发布归档'),
    ],
  },
  {
    version: '0.3.10',
    product: 'AX',
    entries: [
      b('Linux x64/arm64 musl and macOS Intel/Apple Silicon build and install adapters', 'Linux x64/arm64 musl 与 macOS Intel/Apple Silicon 构建与安装适配'),
      b('Atomic executable replacement on Linux to avoid ETXTBSY', 'Linux 上原子性可执行文件替换，避免 ETXTBSY'),
      b('Platform-check CI workflow for Windows, Linux and macOS', '平台检查 CI 工作流，覆盖 Windows、Linux 与 macOS'),
    ],
  },
  {
    version: '0.3.8',
    product: 'AX',
    entries: [
      b('Run SSH project tasks with the local AX runtime; remote hosts need no separate AX install', '用本地 AX 运行时执行 SSH 项目任务；远端无需单独安装 AX'),
      b('Remove fixed SSH-host concurrency cap', '移除固定 SSH 并发上限'),
      b('Preserve provider-supported reasoning-effort values through model metadata', '通过模型元数据保留提供方支持的推理力度值'),
    ],
  },
  {
    version: '0.3.6',
    product: 'AX',
    entries: [
      b('Native Anthropic, Gemini, Vertex, Bedrock and Radius adapters; Azure Responses and Cloudflare Gateway', '原生 Anthropic、Gemini、Vertex、Bedrock、Radius 适配器；Azure Responses 与 Cloudflare Gateway'),
      b('Web search routed through Bocha, Brave, SearxNG with DuckDuckGo fallback; latency tracking and circuit breakers', 'Web 搜索通过 Bocha、Brave、SearxNG 路由，DuckDuckGo 兜底；延迟追踪与熔断器'),
    ],
  },
  {
    version: '0.3.4',
    product: 'AX',
    entries: [
      b('Persistent coding harness: completion review, task-source registration, per-task Git workspaces', '持久化编码运行框架：完成审查、任务源注册、每任务 Git 工作区'),
      b('Preserve patches, receipts and output manifests before cleanup', '清理前保留补丁、收据与输出清单'),
    ],
  },
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
    product: 'AX',
    entries: [
      b('Evolution: append-only experiences.jsonl with a versioned ledger', '演化：追加式 experiences.jsonl，带版本化账本'),
      b('Persisted byte cursors · bounded batches · restart-safe migration', '持久化字节游标 · 有界批次 · 重启安全迁移'),
    ],
  },
  {
    version: '0.3.2',
    product: 'AX',
    entries: [
      b('Frontend child parity', '前端子任务对等'),
      b('Explicit task inputs', '显式任务输入'),
    ],
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
    entries: [
      b('Workspace runtime sandbox', '工作区运行时沙箱'),
      b('Model-directed policies', '模型导向的策略'),
    ],
  },
  // AXCrew
  {
    version: '0.3.7',
    product: 'AXCrew',
    entries: [b('Windows x64 patch release; clarify orchestration and recovery documentation', 'Windows x64 补丁发布；明确编排与恢复文档')],
  },
  {
    version: '0.3.6',
    product: 'AXCrew',
    entries: [
      b('Windows, Linux and macOS native builds from one React/Tauri client', '同一 React/Tauri 客户端构建 Windows、Linux 与 macOS 原生包'),
      b('Unix terminal login shell selection and sysinfo system collection', 'Unix 终端登录 shell 选择与 sysinfo 系统采集'),
      b('All-platform release workflow', '全平台发布工作流'),
    ],
  },
  {
    version: '0.3.5',
    product: 'AXCrew',
    entries: [
      b('SSH host selection and project management; multiple configured SSH hosts without requiring remote AX installs', 'SSH 主机选择与项目管理；多个 SSH 主机配置，无需远端 AX'),
      b('Session task/tool presentation, reasoning-effort controls, retained per-session drafts', '会话任务/工具展示、推理力度控制、每会话草稿保留'),
      b('Host inventory and instance capability management in distributed control plane', '分布式控制平面中的主机资源清单与实例能力管理'),
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
    version: '0.3.2',
    product: 'AXCrew',
    entries: [
      b('Composer workspace controls joined to the project/location strip', '合成器工作区控件与项目/位置条合并'),
      b('Cloud execution shown as unavailable', '云端执行标记为不可用'),
    ],
  },
  {
    version: '0.3.1',
    product: 'AXCrew',
    entries: [
      b('Simplified empty sessions; redesigned composer and model toolbar', '简化空会话；重新设计合成器与模型工具栏'),
      b('Themed language/theme menus', '主题化语言/主题菜单'),
    ],
  },
  {
    version: '0.3.0',
    product: 'AXCrew',
    entries: [
      b('Updater retry + GitCode release mirror', '更新器重试 + GitCode 发布镜像'),
      b('apps/ + crates/ product monorepo', 'apps/ + crates/ 产品单体仓库'),
    ],
  },
  {
    version: '0.2.9',
    product: 'AXCrew',
    entries: [
      b('Subagent controls', '子代理控制'),
      b('Installer fixes', '安装器修复'),
    ],
  },
  {
    version: '0.2.8',
    product: 'AXCrew',
    entries: [
      b('Agent environment settings', '代理环境设置'),
      b('Terminal settings', '终端设置'),
    ],
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
      'One command, verified against SHA256SUMS. Installers fetch the latest GitHub release, verify the archive, and install a single binary. Pin a tag with AX_VERSION or a directory with AX_INSTALL_DIR.',
      '一条命令，按 SHA256SUMS 校验。安装器从 GitHub 拉取最新发布、校验归档，再安装单个二进制文件。用 AX_VERSION 指定 tag，用 AX_INSTALL_DIR 指定目录。',
    ),
    code: 'curl -fsSL https://raw.githubusercontent.com/Axium-Labs/AX/main/scripts/install.sh | sh',
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
    code: 'ax run "find the failing test and fix it"',
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
    code: 'ax mcp tools <server>',
  },
  {
    id: 'memory',
    title: b('Memory', '记忆'),
    body: b(
      'Three scopes — Global, Project, Session — in SQLite with append-only JSONL history. Retrieval filters by owner, recalls at most 32 candidates, reranks lightly and injects bounded summaries. No embeddings, no vector store, no extra model call.',
      '三层作用域——全局、项目、会话——存于 SQLite，历史为追加式 JSONL。检索按归属者过滤、最多召回 32 个候选、轻度重排后注入有界摘要。无向量嵌入、无向量库、无额外模型调用。',
    ),
  },
  {
    id: 'subagents',
    title: b('Subagents', '子代理'),
    body: b(
      "The main model decides when delegation helps research, writing, analysis or coding. Ordinary subagents and queue children share depth, concurrency and inherited permission ceilings. AXCrew\u2019s Plugins \u2192 Agents page controls global/project limits: depth 0 disables local delegation, 1 permits direct children, and larger depths permit nesting. Data inventories alone do not start children.",
      '主模型按任务需要判断是否委派，适用于调研、写作、分析和编程。普通子智能体与队列子任务共享深度、并行名额和继承的权限上限。AXCrew 的「插件 → 智能体」页可设置全局或项目限制：深度 0 关闭本地委派，1 允许直接子智能体，更大的深度允许递归。数据清单本身不会自动启动子任务。',
    ),
  },
  {
    id: 'sandbox',
    title: b('Sandbox', '沙箱'),
    body: b(
      'File and terminal tools use the workspace sandbox; native OS confinement currently requires Linux. Application/site access and action approvals are separate from the file/terminal boundary. Windows/macOS native sandbox backends remain unavailable.',
      '文件与终端工具遵循工作区沙箱；原生操作系统隔离目前需要 Linux。应用、网站访问与操作审批与文件/终端边界分开管理。Windows/macOS 原生沙箱后端尚未实现。',
    ),
  },
  {
    id: 'providers',
    title: b('Providers', '模型提供方'),
    body: b(
      'Provider-neutral. OpenAI-compatible endpoints (DeepSeek, Groq, Mistral, OpenRouter, xAI, Kimi, …), OpenAI Responses, native Anthropic/Gemini/Vertex/Bedrock/Radius adapters, Codex device-flow OAuth, WorkBuddy account login. Implement ModelProvider to add a local model — no loop changes.',
      '提供方中立。OpenAI 兼容端点（DeepSeek、Groq、Mistral、OpenRouter、xAI、Kimi……）、OpenAI Responses、原生 Anthropic/Gemini/Vertex/Bedrock/Radius 适配器、Codex 设备流 OAuth、WorkBuddy 账号。实现 ModelProvider 即可接入本地模型，主循环无需改动。',
    ),
    code: 'DEEPSEEK_API_KEY=… ax --provider deepseek --model deepseek-chat',
  },
  {
    id: 'acp',
    title: b('ACP adapter', 'ACP 适配器'),
    body: b(
      'ax acp speaks Agent Client Protocol v1 over stdio: initialize, session/new, load, resume, prompt, cancel, plus read-only _ax/status, _ax/models, _ax/tools, _ax/capabilities and scopedCapabilities. One JSON-RPC object per line.',
      'ax acp 通过 stdio 讲 Agent Client Protocol v1：initialize、session/new、load、resume、prompt、cancel，以及只读的 _ax/status、_ax/models、_ax/tools、_ax/capabilities 与 scopedCapabilities。每行一个 JSON-RPC 对象。',
    ),
    code: 'ax acp',
  },
  {
    id: 'crew',
    title: b('AXCrew', 'AXCrew'),
    body: b(
      'A Rust control plane with a desktop client (Tauri 2 + React) and an Android client. Schedules deterministic task DAGs across paired AX devices, maintains device identity, brokers approvals, and streams live CrewEvent JSON. AX keeps history, memory, tools and credentials.',
      '一个 Rust 控制平面，带桌面客户端（Tauri 2 + React）与 Android 客户端。在已配对的 AX 设备之间调度确定性任务 DAG，维护设备身份，代理审批，并流式输出实时 CrewEvent JSON。历史、记忆、工具与凭据始终留在 AX 侧。',
    ),
    code: 'axcrew up\nax crew pair <code> --gateway https://crew.example.com',
  },
  {
    id: 'cli',
    title: b('CLI reference', 'CLI 参考'),
    body: b(
      'Everything is reachable from one binary. Sessions resume across restarts; goals can be suspended, resumed, superseded or cancelled without losing checkpointed work. /system shows measured CPU, memory and NVIDIA GPU usage on demand.',
      '一切都可以从同一个二进制触达。会话跨重启恢复；目标可挂起、恢复、被取代或取消，且不丢失已断点的工作。/system 按需展示实测 CPU、内存与 NVIDIA GPU 用量。',
    ),
  },
];
