/**
 * Demo data model — single source of truth for fleet / task / boundary visuals.
 *
 * Policy: no fake latency, no invented task ids, no timestamps, no telemetry.
 * Commands and terminal output stay English exactly as the real tools print them.
 * Node names and labels are bilingual (B).
 */

import { b, type B } from './i18n';

/* ============================================================
   Machines
   ============================================================ */

export interface Machine {
  id: string;
  name: B;
  detail: B;
}

export const MACHINES: Machine[] = [
  { id: 'laptop',  name: b('Laptop',   '笔记本'),    detail: b('dev',          '开发机') },
  { id: 'server',  name: b('Server',   '服务器'),    detail: b('build · Linux', '构建 · Linux') },
  { id: 'gpu',     name: b('GPU Box',  'GPU 机器'),  detail: b('bench · RTX',  '基准 · RTX') },
  { id: 'cloud',   name: b('Cloud VM', '云虚拟机'),  detail: b('inference',     '推理') },
];

export function machineOf(id: string): Machine {
  return MACHINES.find((m) => m.id === id) ?? MACHINES[0];
}

/* ============================================================
   FleetNetwork — current machine states shown to visitor
   ============================================================ */

export interface MachineState {
  id: string;
  /** brief activity description, terminal output style */
  activity: B;
  /** 'active' | 'idle' | 'busy' */
  state: 'active' | 'idle' | 'busy';
}

export const MACHINE_STATES: MachineState[] = [
  { id: 'laptop', state: 'active', activity: b('session · writing tests',   '会话 · 编写测试') },
  { id: 'server', state: 'busy',   activity: b('cargo build --release',     'cargo build --release') },
  { id: 'gpu',    state: 'idle',   activity: b('idle · ready',              '空闲 · 就绪') },
  { id: 'cloud',  state: 'idle',   activity: b('idle · ready',              '空闲 · 就绪') },
];

/* ============================================================
   Task journey — what happens when you run a task.
   Kept deliberately simple: one machine does one job.
   ============================================================ */

export interface TaskStep {
  /** 'local' = runs on the initiating machine, 'remote' = delegated, 'crew' = control plane, 'done' = final */
  kind: 'local' | 'remote' | 'crew' | 'done';
  /** node id or 'axcrew' */
  actor: string;
  cmd: string;
  out: B;
}

export const TASK_JOURNEY: TaskStep[] = [
  {
    kind: 'local',
    actor: 'laptop',
    cmd: 'ax run "write tests for the sort module"',
    out: b('AX · starting · local session', 'AX · 启动 · 本机会话'),
  },
  {
    kind: 'local',
    actor: 'laptop',
    cmd: 'edit tests/sort_test.rs',
    out: b('+47 lines · 6 new tests', '+47 行 · 6 个新测试'),
  },
  {
    kind: 'crew',
    actor: 'axcrew',
    cmd: 'route · build → server',
    out: b('server · online · accepted', '服务器 · 在线 · 已接受'),
  },
  {
    kind: 'remote',
    actor: 'server',
    cmd: 'cargo test --lib sort',
    out: b('✓ 6 passed · 0 failed', '✓ 6 通过 · 0 失败'),
  },
  {
    kind: 'done',
    actor: 'laptop',
    cmd: '← result',
    out: b('✓ receipt stored · done', '✓ 收据已存 · 完成'),
  },
];

/* ============================================================
   CrewUI — desktop + mobile control surfaces
   ============================================================ */

export interface CrewNavItem {
  id: string;
  label: B;
}

export interface CrewUiDevice {
  id: string;
  name: B;
  status: B;
  task: B;
}

export interface CrewUiTask {
  title: B;
  node: B;
  status: B;
}

export interface CrewUiEvent {
  line: string;
}

export const CREW_UI = {
  desktop: {
    nav: [
      { id: 'sessions',   label: b('Sessions',    '会话') },
      { id: 'tasks',      label: b('Tasks',       '任务') },
      { id: 'approvals',  label: b('Approvals',   '审批') },
      { id: 'plugins',    label: b('Plugins',     '插件') },
      { id: 'settings',   label: b('Settings',    '设置') },
    ] as CrewNavItem[],
    devices: [
      { id: 'laptop', name: b('Laptop',   '笔记本'),  status: b('active',   '活跃'),   task: b('writing tests', '编写测试') },
      { id: 'server', name: b('Server',   '服务器'),  status: b('running',  '运行中'), task: b('cargo test',    'cargo test') },
      { id: 'gpu',    name: b('GPU Box',  'GPU 机器'), status: b('idle',     '空闲'),   task: b('—',             '—') },
      { id: 'cloud',  name: b('Cloud VM', '云虚拟机'), status: b('idle',     '空闲'),   task: b('—',             '—') },
    ] as CrewUiDevice[],
    tasks: [
      { title: b('write tests for the sort module', '为排序模块编写测试'), node: b('laptop · local', '笔记本 · 本机'), status: b('running', '运行中') },
      { title: b('cargo test --lib sort',           'cargo test --lib sort'),           node: b('server · build', '服务器 · 构建'),  status: b('running', '运行中') },
      { title: b('review test output',              '审阅测试输出'),                    node: b('laptop · local', '笔记本 · 本机'), status: b('awaiting approval', '等待审批') },
    ] as CrewUiTask[],
    events: [
      { line: 'laptop · ax run "write tests for the sort module"' },
      { line: 'ax · edit tests/sort_test.rs · +47 lines' },
      { line: 'axcrew · route cargo test → server' },
      { line: 'server · cargo test --lib sort · ✓ 6 passed' },
      { line: 'result → laptop · receipt stored' },
    ] as CrewUiEvent[],
  },
  mobile: {
    header: b('AXCrew', 'AXCrew'),
    sections: [
      { id: 'tasks',     label: b('Tasks',     '任务') },
      { id: 'approvals', label: b('Approvals', '审批') },
    ] as CrewNavItem[],
    tasks: [
      { title: b('write tests for the sort module', '为排序模块编写测试'), node: b('laptop', '笔记本'), status: b('running', '运行中') },
      { title: b('cargo test --lib sort',           'cargo test'),        node: b('server',  '服务器'),  status: b('running', '运行中') },
    ] as CrewUiTask[],
    approvals: [
      b('filesystem · write tests/sort_test.rs · laptop', 'filesystem · 写入 tests/sort_test.rs · 笔记本'),
      b('shell · cargo test --lib sort · server',          'shell · cargo test --lib sort · 服务器'),
    ] as B[],
  },
} as const;

/* ============================================================
   Boundaries — four concepts, one line each
   ============================================================ */

export interface Boundary {
  name: B;
  body: B;
}

export const BOUNDARIES: Boundary[] = [
  {
    name: b('Workspace', '工作区'),
    body: b(
      'Each AX owns its project directory. Work stays on the machine that runs it.',
      '每个 AX 拥有自己的项目目录。工作留在运行它的那台机器上。',
    ),
  },
  {
    name: b('Sandbox', '沙箱'),
    body: b(
      'OS-level confinement under every tool. Fail closed; native confinement requires Linux.',
      '每个工具之下是操作系统级隔离。失败即关闭；原生隔离需要 Linux。',
    ),
  },
  {
    name: b('Permissions', '权限'),
    body: b(
      'Per-node allow / ask / deny. AXCrew never bypasses a node\'s own grants.',
      '每个节点独立的 allow / ask / deny。AXCrew 从不绕过节点自己的授权。',
    ),
  },
  {
    name: b('Identity', '身份'),
    body: b(
      'Ed25519 device pairing. Private keys never leave the device; transport is outbound WSS.',
      'Ed25519 设备配对。私钥永不离开设备；传输走出站 WSS。',
    ),
  },
];

/* Legacy exports so old references don't break at compile time */
export const SEND_WORK = {
  title: b('Write tests for the sort module', '为排序模块编写测试'),
  task:  b('One request. Two machines.', '一个请求。两台机器。'),
  steps: TASK_JOURNEY.map((s) => ({
    node: s.actor,
    dir:  s.kind === 'done' ? 'back' : s.kind === 'crew' ? 'out' : s.kind === 'remote' ? 'out' : 'local',
    cmd:  s.cmd,
    out:  typeof s.out === 'string' ? s.out : s.out.en,
  })),
};

export const FLOW_STEPS = TASK_JOURNEY.map((s, i) => ({
  phase: (i === TASK_JOURNEY.length - 1 ? 'done' : i === 2 ? 'route' : i === 3 ? 'execute' : 'route') as 'route' | 'execute' | 'return' | 'done',
  from: s.actor,
  to:   s.actor,
  label: s.out,
}));

export const PHASE_SHORT = {
  route:   b('routing',   '路由中'),
  execute: b('executing', '执行中'),
  return:  b('returning', '返回中'),
  done:    b('done',      '完成'),
} as const;

export type FlowPhase = 'route' | 'execute' | 'return' | 'done';
export const AX_NODES = ['ax-01', 'ax-02', 'ax-03', 'ax-04'] as const;
