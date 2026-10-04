/**
 * Demo data model — the single source for every fleet / task / boundary
 * shown on the site. No component hard-codes nodes or tasks anymore.
 *
 * Policy: no fake latency, no invented task ids, no timestamps, no
 * telemetry decoration. Nodes and task labels are bilingual (B);
 * commands and terminal output stay English — exactly as the real
 * tools print them.
 */

import { b, type B } from './i18n';

/* ============================================================
   Machines — every machine runs its own AX.
   ============================================================ */

export interface Machine {
  id: string;
  name: B;
  detail: B;
}

export const MACHINES: Machine[] = [
  { id: 'laptop', name: b('Laptop', '笔记本'), detail: b('dev · macOS', '开发 · macOS') },
  { id: 'server', name: b('Server', '服务器'), detail: b('build · Linux', '构建 · Linux') },
  { id: 'gpu', name: b('GPU Server', 'GPU 服务器'), detail: b('bench · RTX 4090', '基准 · RTX 4090') },
  { id: 'cloud', name: b('Cloud VM', '云虚拟机'), detail: b('inference · EU spot', '推理 · 欧盟竞价') },
];

/** One AX per machine, same order as MACHINES. */
export const AX_NODES = ['ax-01', 'ax-02', 'ax-03', 'ax-04'] as const;

export function machineOf(id: string): Machine {
  return MACHINES.find((m) => m.id === id) ?? MACHINES[0];
}

/* ============================================================
   Hero signature flow — one task travelling the fleet.
   Laptop asks → AXCrew routes → a machine executes → result returns.
   ============================================================ */

export type FlowPhase = 'route' | 'execute' | 'return' | 'done';

export interface FlowStep {
  phase: FlowPhase;
  /** device id the packet is at / heading to */
  from: string;
  to: string;
  label: B;
}

export const FLOW_STEPS: FlowStep[] = [
  { phase: 'route', from: 'laptop', to: 'server', label: b('route · laptop → server', '路由 · 笔记本 → 服务器') },
  { phase: 'execute', from: 'server', to: 'server', label: b('execute · cargo build --release', '执行 · cargo build --release') },
  { phase: 'return', from: 'server', to: 'laptop', label: b('result · server → laptop', '结果 · 服务器 → 笔记本') },
  { phase: 'done', from: 'laptop', to: 'laptop', label: b('done · receipt stored', '完成 · 收据已存') },
];

/** Phase label for the hero status line (short). */
export const PHASE_SHORT: Record<FlowPhase, B> = {
  route: b('routing', '路由中'),
  execute: b('executing', '执行中'),
  return: b('returning', '返回中'),
  done: b('done', '完成'),
};

/* ============================================================
   Send work where it belongs — the one complete real scenario:
   laptop writes code → AXCrew routes the build → server compiles →
   AXCrew routes the bench → GPU runs it → result returns to laptop.
   ============================================================ */

export interface WorkStep {
  /** device id; 'axcrew' means the control plane step */
  node: string;
  /** direction of travel relative to the requester */
  dir: 'out' | 'back' | 'local';
  cmd: string;
  out: string;
}

export const SEND_WORK = {
  title: b('Optimize the sort benchmark', '优化排序基准测试'),
  task: b('One request. Four machines touch it.', '一个请求。四台机器参与。'),
  steps: [
    { node: 'laptop', dir: 'local', cmd: 'ax run "optimize the sort benchmark"', out: 'patch · src/sort.rs · +38 −12' },
    { node: 'axcrew', dir: 'out', cmd: 'route · build → server', out: 'build · linux · online' },
    { node: 'server', dir: 'out', cmd: 'cargo build --release', out: '✓ compiled · 12 crates' },
    { node: 'axcrew', dir: 'out', cmd: 'route · bench → gpu-box', out: 'bench · rtx 4090 · online' },
    { node: 'gpu', dir: 'out', cmd: 'cargo bench --bench sort', out: '✓ 214 runs · p50 3.1ms' },
    { node: 'laptop', dir: 'back', cmd: '← result', out: '✓ receipt stored · done' },
  ],
} as const;

/* ============================================================
   Control every machine — AXCrew Desktop / Mobile product UI.
   Mirrors the real app: crews, agents, tasks, approvals, events.
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
  /** terminal output — stays English */
  line: string;
}

export const CREW_UI = {
  desktop: {
    nav: [
      { id: 'crews', label: b('Crews', '集群') },
      { id: 'agents', label: b('Agents', '代理') },
      { id: 'tasks', label: b('Tasks', '任务') },
      { id: 'approvals', label: b('Approvals', '审批') },
      { id: 'settings', label: b('Settings', '设置') },
    ] as CrewNavItem[],
    devices: [
      { id: 'laptop', name: b('Laptop', '笔记本'), status: b('online', '在线'), task: b('writing fix', '编写修复') },
      { id: 'server', name: b('Server', '服务器'), status: b('building', '构建中'), task: b('cargo build --release', 'cargo build --release') },
      { id: 'gpu', name: b('GPU Server', 'GPU 服务器'), status: b('benchmarking', '基准测试中'), task: b('cargo bench --bench sort', 'cargo bench --bench sort') },
      { id: 'cloud', name: b('Cloud VM', '云虚拟机'), status: b('idle', '空闲'), task: b('—', '—') },
    ] as CrewUiDevice[],
    tasks: [
      { title: b('optimize the sort benchmark', '优化排序基准测试'), node: b('server · build', '服务器 · 构建'), status: b('running', '运行中') },
      { title: b('bench the sort kernel', '对排序内核跑基准'), node: b('gpu-box · bench', 'GPU · 基准'), status: b('queued', '排队中') },
      { title: b('review the patch', '审阅补丁'), node: b('laptop · local', '笔记本 · 本机'), status: b('awaiting approval', '等待审批') },
    ] as CrewUiTask[],
    events: [
      { line: 'crew-a · laptop → axcrew · "optimize the sort benchmark"' },
      { line: 'axcrew · route build → server · linux' },
      { line: 'server · cargo build --release · ✓' },
      { line: 'axcrew · route bench → gpu-box · rtx 4090' },
      { line: 'gpu-box · cargo bench --bench sort · ✓ 214 runs' },
      { line: 'result → laptop · receipt stored' },
    ] as CrewUiEvent[],
  },
  mobile: {
    header: b('AXCrew · control', 'AXCrew · 控制'),
    sections: [
      { id: 'fleet', label: b('Fleet', '集群') },
      { id: 'tasks', label: b('Tasks', '任务') },
      { id: 'approvals', label: b('Approvals', '审批') },
    ] as CrewNavItem[],
    tasks: [
      { title: b('optimize the sort benchmark', '优化排序基准测试'), node: b('server · build', '服务器 · 构建'), status: b('running', '运行中') },
      { title: b('bench the sort kernel', '对排序内核跑基准'), node: b('gpu-box · bench', 'GPU · 基准'), status: b('queued', '排队中') },
    ] as CrewUiTask[],
    approvals: [
      b('shell · cargo build --release · server', 'shell · cargo build --release · 服务器'),
      b('filesystem · write src/sort.rs · laptop', 'filesystem · 写入 src/sort.rs · 笔记本'),
    ] as B[],
  },
} as const;

/* ============================================================
   Connected. Not merged. — every machine keeps its boundary.
   ============================================================ */

export interface Boundary {
  name: B;
  body: B;
}

export const BOUNDARIES: Boundary[] = [
  {
    name: b('Workspace', '工作区'),
    body: b(
      'Each AX owns its project workspace. Work stays on the machine that runs it.',
      '每个 AX 拥有自己的项目工作区。工作留在运行它的那台机器上。',
    ),
  },
  {
    name: b('Sandbox', '沙箱'),
    body: b(
      'OS-level confinement under every tool — quotas, TTLs, fail closed.',
      '每个工具之下是操作系统级隔离——配额、TTL、失败即关闭。',
    ),
  },
  {
    name: b('Permissions', '权限'),
    body: b(
      'Per-node allow / ask / deny. AXCrew never bypasses a node\u2019s own grants.',
      '每个节点独立的 allow / ask / deny。AXCrew 从不绕过节点自己的授权。',
    ),
  },
  {
    name: b('Device identity', '设备身份'),
    body: b(
      'Ed25519 pairing. Keys never leave the device; transport is outbound WSS.',
      'Ed25519 配对。密钥永不离开设备；传输走出站 WSS。',
    ),
  },
];
