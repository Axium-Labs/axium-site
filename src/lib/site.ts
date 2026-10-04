import { b, type B } from './i18n';

export const SITE = {
  name: 'AXIUM',
  domain: 'https://axium.dev',
  axVersion: '0.3.6',
  crewVersion: '0.3.2',
  tagline: b(
    'One agent system across every machine you own.',
    '一个代理系统，覆盖你拥有的每一台机器。',
  ),
  description: b(
    'AX runs agents on your laptop, server, GPU box and cloud VM — each machine an isolated node. AXCrew wires them into one control plane: delegate from any node, run anywhere, get the result back.',
    'AX 在你自己的笔记本电脑、服务器、GPU 机器与云虚拟机上运行代理——每台机器都是一个隔离节点。AXCrew 把它们接入同一个控制平面：从任意节点委派、在任意机器执行、结果回到发起方。',
  ),
} as const;

export interface NavItem {
  href: string;
  label: B;
}

export const NAV: NavItem[] = [
  { href: '/ax', label: { en: 'AX', zh: 'AX' } },
  { href: '/crew', label: { en: 'AXCrew', zh: 'AXCrew' } },
  { href: '/docs', label: b('Docs', '文档') },
  { href: '/download', label: b('Download', '下载') },
  { href: '/changelog', label: b('Changelog', '更新') },
];

/**
 * Install commands — verbatim from the AX repository README
 * (raw.githubusercontent.com/Axium-Labs/AX/main/scripts/).
 */
export const INSTALL = {
  unix: 'curl -fsSL https://raw.githubusercontent.com/Axium-Labs/AX/main/scripts/install.sh | sh',
  windows:
    'powershell -ExecutionPolicy Bypass -c "iex ((iwr \'https://raw.githubusercontent.com/Axium-Labs/AX/main/scripts/install.ps1\' -UseBasicParsing).Content)"',
} as const;

export const AFTER_INSTALL = ['ax --version', 'ax run "hello from a real machine"'] as const;

export interface FooterCol {
  title: B;
  links: { href: string; label: B }[];
}

export const FOOTER_COLS: FooterCol[] = [
  {
    title: b('Product', '产品'),
    links: [
      { href: '/ax', label: b('AX — Agent Runtime', 'AX —— 代理运行时') },
      { href: '/crew', label: b('AXCrew — Orchestration', 'AXCrew —— 编排') },
      { href: '/download', label: b('Download', '下载') },
      { href: '/changelog', label: b('Changelog', '更新') },
    ],
  },
  {
    title: b('Docs', '文档'),
    links: [
      { href: '/docs#runtime', label: b('Runtime', '运行时') },
      { href: '/docs#tools', label: b('Tools & Skills', '工具与技能') },
      { href: '/docs#mcp', label: b('MCP', 'MCP') },
      { href: '/docs#memory', label: b('Memory', '记忆') },
      { href: '/docs#sandbox', label: b('Sandbox', '沙箱') },
      { href: '/docs#crew', label: b('AXCrew · Protocol', 'AXCrew · 协议') },
    ],
  },
  {
    title: b('System', '系统'),
    links: [
      { href: '/docs#providers', label: b('Providers', '模型提供方') },
      { href: '/docs#subagents', label: b('Subagents', '子代理') },
      { href: '/docs#cli', label: b('CLI reference', 'CLI 参考') },
      { href: '/docs#acp', label: b('ACP adapter', 'ACP 适配器') },
    ],
  },
];
