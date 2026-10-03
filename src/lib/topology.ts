/**
 * CrewTopology — devices → AXCrew control plane → AX nodes, plus the
 * fleet task flow (dynamic). Grounded in AXCrew: paired devices
 * (Ed25519 handshake), the crew gateway, deterministic task DAGs
 * scheduled across AX devices, live CrewEvent stream.
 */

import { b, type B, type Lang } from './i18n';

export interface Device {
  id: string;
  name: B;
  detail: B;
  latency: string;
}

/** Every machine runs its own AX; AXCrew sits above them all. */
export const DEVICES: Device[] = [
  { id: 'laptop', name: b('Laptop', '笔记本'), detail: b('dev · macos', '开发 · macos'), latency: '18ms' },
  { id: 'server', name: b('Server', '服务器'), detail: b('build · linux', '构建 · linux'), latency: '9ms' },
  { id: 'gpu', name: b('GPU Server', 'GPU 服务器'), detail: b('local · rtx 4090', '本机 · rtx 4090'), latency: '12ms' },
  { id: 'cloud', name: b('Cloud VM', '云虚拟机'), detail: b('eu-central · spot', '欧中区 · 竞价实例'), latency: '64ms' },
];

/** One AX per device, in the same order as DEVICES. */
export const AX_NODES = ['ax-01', 'ax-02', 'ax-03', 'ax-04'] as const;

export interface FleetTask {
  id: string;
  cmd: B;
  /** the node that asks (device id) */
  from: string;
  /** the node that runs it (device id) */
  to: string;
  kind: B;
  result: B;
}

/**
 * The homepage scenario: one request enters on the laptop, AXCrew
 * routes each task to the machine that fits — code on the build
 * server, tests on the GPU box, inference on the cloud VM.
 */
export const FLEET_TASKS: FleetTask[] = [
  { id: 't-1041', cmd: b('run "bump patch version"', '运行 "bump patch version"'), from: 'laptop', to: 'server', kind: b('code', '代码'), result: b('patch applied · 1 file', '补丁已应用 · 1 个文件') },
  { id: 't-1042', cmd: b('run "test suite"', '运行 "test suite"'), from: 'laptop', to: 'gpu', kind: b('test', '测试'), result: b('214 passed · 0 failed', '214 通过 · 0 失败') },
  { id: 't-1043', cmd: b('run "bench inference"', '运行 "bench inference"'), from: 'laptop', to: 'cloud', kind: b('inference', '推理'), result: b('p99 3.1ms · 18 runs', 'p99 3.1ms · 18 次运行') },
];

/** Initial rows shown in the fleet status table before the flow starts. */
export function psTable(lang: Lang): string[][] {
  return [
    [b('device', '设备')[lang], b('status', '状态')[lang], b('task', '任务')[lang], b('latency', '延迟')[lang]],
    ['laptop', '● run', b('t-1041 → server · awaiting result', 't-1041 → 服务器 · 等待结果')[lang], '18ms'],
    ['server', '● run', b('t-1041 · bump patch version', 't-1041 · bump patch version')[lang], '9ms'],
    ['gpu', '● run', b('t-1042 · run test suite', 't-1042 · 运行测试套件')[lang], '12ms'],
    ['cloud', '● run', b('t-1043 · bench inference', 't-1043 · 推理基准')[lang], '64ms'],
  ];
}

/** Static opening lines for the live event ticker (terminal output — stays EN). */
export const CREW_LOG_POOL: string[] = [
  'crew-a · laptop → axcrew · t-1041 · run "bump patch version"',
  'crew-a · laptop → axcrew · t-1042 · run "test suite"',
  'crew-a · laptop → axcrew · t-1043 · run "bench inference"',
  'axcrew · t-1041 → server · build · linux',
  'axcrew · t-1042 → gpu · rtx 4090',
  'axcrew · t-1043 → cloud · eu-central · spot',
];

/** AXCrew console (desktop / mobile) event rows (terminal output — stays EN). */
export const CONSOLE_EVENTS: string[] = [
  '[21:37:14] crew-a · t-1042 routed → gpu-box',
  '[21:37:16] gpu-box · shell "cargo test" · running',
  '[21:37:19] gpu-box · 214 passed · result → laptop',
  '[21:37:21] crew-a · t-1041 done · patch applied',
];
