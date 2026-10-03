/**
 * Terminal scripts — the "see AX working" material.
 * Grounded in the real AX runtime: tools, memory scopes, subagents,
 * sandbox, multi-provider, checkpointed sessions.
 */

export type TermKind = 'cmd' | 'out' | 'ok' | 'warn' | 'err' | 'dim' | 'sys' | 'diff';

export interface TermLine {
  kind: TermKind;
  text: string;
}

export const BOOT: TermLine[] = [
  { kind: 'sys', text: 'AX runtime 0.3.3 · rust · single static binary' },
  { kind: 'sys', text: 'session a1f2 · cwd ~/src/axlab' },
  { kind: 'sys', text: 'providers: openai · deepseek · groq · codex(local)' },
  { kind: 'sys', text: 'memory: 3 scopes · sandbox: on · skills: lazy' },
  { kind: 'ok', text: 'ready. type `help` — or just run a task.' },
];

export const HELP: TermLine[] = [
  { kind: 'out', text: 'commands' },
  { kind: 'dim', text: '  status   loop, rounds, memory, sandbox' },
  { kind: 'dim', text: '  agents   named agents · global scope' },
  { kind: 'dim', text: '  mem      session / project / global facts' },
  { kind: 'dim', text: '  run "…"  one task, end to end' },
  { kind: 'dim', text: '  clear    reset the view' },
];

export const STATUS: TermLine[] = [
  { kind: 'out', text: 'agent loop   running · 1 goal active' },
  { kind: 'out', text: 'tool rounds  dependency DAG · concurrency 4' },
  { kind: 'out', text: 'subagents    enabled · max_concurrent 3' },
  { kind: 'out', text: 'memory       session 12 · project 38 · global 9' },
  { kind: 'out', text: 'sandbox      workspace runtime · boundary on' },
  { kind: 'out', text: 'providers    openai(responses) · deepseek(chat) · groq(chat)' },
  { kind: 'out', text: 'latency      p50 1.4s · p99 3.2s · last call 2.1s' },
];

export const AGENTS: TermLine[] = [
  { kind: 'out', text: 'named agents · global scope' },
  { kind: 'dim', text: 'reviewer   tools: filesystem, find_files, search' },
  { kind: 'dim', text: 'rust-dev   tools: shell, patch, search' },
  { kind: 'dim', text: 'frontend   tools: shell, web, search' },
  { kind: 'ok', text: '3 agents · instructions load on invoke' },
];

export const MEM: TermLine[] = [
  { kind: 'out', text: 'session 12 · project 38 · global 9' },
  { kind: 'dim', text: 'remember response.detail=brief        session' },
  { kind: 'dim', text: 'remember build.command=cargo test    project' },
  { kind: 'dim', text: 'remember response.language=English   global' },
  { kind: 'ok', text: 'layered retrieval · no embeddings · SQLite + JSONL' },
];

/** The flagship demo: a task that touches files, runs tools and writes memory. */
export const RUN_TASK: TermLine[] = [
  { kind: 'cmd', text: 'ax run "add a --dry-run flag to the deploy script"' },
  { kind: 'out', text: 'goal     deploy-script-dry-run' },
  { kind: 'out', text: 'plan     3 steps · workspace src/scripts' },
  { kind: 'out', text: 'loop     model deepseek · context 3.1k tokens' },
  { kind: 'ok', text: 'round 1 · 2 independent tools' },
  { kind: 'dim', text: '├ search   pattern:"dry.run" · root:src/scripts' },
  { kind: 'dim', text: '└ read     src/scripts/deploy.ps1' },
  { kind: 'ok', text: 'round 1 · 2 results · 1.8s' },
  { kind: 'out', text: 'round 2 · patch src/scripts/deploy.ps1' },
  { kind: 'diff', text: '+ param([switch]$DryRun)' },
  { kind: 'diff', text: '+ if ($DryRun) { Write-Host "[dry-run] " + $Command }' },
  { kind: 'ok', text: 'patch applied · 1 file · +2 / -0' },
  { kind: 'out', text: 'round 3 · shell "powershell -File tests\\smoke.ps1"' },
  { kind: 'ok', text: 'tests · 12 passed · 0 failed · 9.4s' },
  { kind: 'sys', text: 'memory · project fact updated' },
  { kind: 'ok', text: 'task complete · 3 rounds · 6 tool calls · 31s' },
];

/** Homepage delegate scene: a task leaves the laptop and runs on the GPU box. */
export const DELEGATE: TermLine[] = [
  { kind: 'cmd', text: 'ax run "bench the kernel" --on gpu-box' },
  { kind: 'out', text: '→ axcrew · route gpu-box · t-1042' },
  { kind: 'dim', text: '  gpu-box · rust · rtx 4090 · online' },
  { kind: 'out', text: '→ gpu-box · shell "cargo bench" · running' },
  { kind: 'dim', text: '  gpu-box · 18ms p50 · 214 runs' },
  { kind: 'ok', text: '← laptop · result t-1042 · receipt stored' },
];

export const UNKNOWN: TermLine[] = [
  { kind: 'warn', text: 'unknown command. try `help`.' },
];

/** Display helper maps a kind to its terminal color class. */
export const KIND_CLASS: Record<TermKind, string> = {
  cmd: 'term-cmd',
  out: 'term-dim',
  ok: 'term-ok',
  warn: 'term-warn',
  err: 'term-err',
  dim: 'term-dim',
  sys: 'term-focus',
  diff: 'term-cmd',
};
