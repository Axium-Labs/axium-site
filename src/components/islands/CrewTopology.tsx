import { useEffect, useRef, useState } from 'react';
import { AX_NODES, CREW_LOG_POOL, DEVICES, FLEET_TASKS, psTable, type FleetTask } from '../../lib/topology';
import type { Lang } from '../../lib/i18n';

/**
 * Fleet flow — devices → AXCrew hub → AX nodes, with live tasks moving
 * between machines. Each task cycles: route in → dispatch → execute →
 * return → done. Dots are positioned at phase targets and CSS-transitioned,
 * so rendering happens only on phase changes (reduced-motion safe).
 */

const DEV_Y = [66, 138, 210, 282];
const AX_Y = [110, 196, 282, 368];
const HUB_LEFT = { x: 292, y: 210 };
const HUB_RIGHT = { x: 468, y: 210 };

type Phase = 0 | 1 | 2 | 3 | 4 | 5;

interface FlowState {
  task: FleetTask;
  fromIdx: number;
  toIdx: number;
  phase: Phase;
}

const PHASE_MS: Record<Phase, number> = { 0: 1400, 1: 1400, 2: 2600, 3: 1400, 4: 1400, 5: 1400 };
const STAGGER_MS = [600, 3400, 6200];
const INITIAL_POOL = CREW_LOG_POOL.slice(0, 4);

function now() {
  return new Date().toLocaleTimeString('en-GB', { hour12: false });
}

function dotTarget(s: FlowState): { x: number; y: number } {
  switch (s.phase) {
    case 0:
      return { x: HUB_LEFT.x, y: HUB_LEFT.y };
    case 1:
      return { x: 606, y: AX_Y[s.toIdx] };
    case 2:
      return { x: 606, y: AX_Y[s.toIdx] };
    case 3:
      return { x: HUB_RIGHT.x, y: HUB_RIGHT.y };
    case 4:
      return { x: 186, y: DEV_Y[s.fromIdx] };
    case 5:
      return { x: 186, y: DEV_Y[s.fromIdx] };
  }
}

function logFor(s: FlowState, lang: Lang): string {
  const from = DEVICES[s.fromIdx].name[lang].toLowerCase();
  const to = DEVICES[s.toIdx].name[lang].toLowerCase();
  switch (s.phase) {
    case 0:
      return `[${now()}] ${from} → axcrew · ${s.task.id} · ${s.task.cmd[lang]}`;
    case 1:
      return `[${now()}] axcrew → ${to} · ${s.task.id} · dispatch`;
    case 2:
      return `[${now()}] ${to} · ${s.task.kind[lang]} · running`;
    case 3:
      return `[${now()}] ${to} · ${s.task.result[lang]}`;
    case 4:
      return `[${now()}] result → ${from} · ${s.task.id}`;
    case 5:
      return `[${now()}] ${from} · ${s.task.id} · complete`;
  }
}

const PHASE_WORD: Record<Phase, [string, string]> = {
  0: ['routing', '路由中'],
  1: ['dispatching', '调度中'],
  2: ['executing', '执行中'],
  3: ['returning', '返回中'],
  4: ['returning', '返回中'],
  5: ['complete', '完成'],
};

function phaseWord(s: FlowState, lang: Lang): string {
  return PHASE_WORD[s.phase][lang === 'zh' ? 1 : 0];
}

const NODE_STATE: Record<string, [string, string]> = {
  busy: ['busy', '忙碌'],
  working: ['working', '工作中'],
  idle: ['idle', '空闲'],
};

function nodeState(key: string, lang: Lang): string {
  return NODE_STATE[key][lang === 'zh' ? 1 : 0];
}

function initialFlow(task: FleetTask, idx: number): FlowState {
  const fromIdx = DEVICES.findIndex((d) => d.id === task.from);
  const toIdx = DEVICES.findIndex((d) => d.id === task.to);
  return { task, fromIdx, toIdx, phase: idx === 0 ? 1 : idx === 1 ? 2 : 3 };
}

export default function CrewTopology({ lang = 'en' }: { lang?: Lang }) {
  const [flows, setFlows] = useState<FlowState[]>(() => FLEET_TASKS.map(initialFlow));
  const [logs, setLogs] = useState<string[]>(INITIAL_POOL);
  const [focus, setFocus] = useState<number>(0);
  const flowsRef = useRef(flows);
  const logsRef = useRef(INITIAL_POOL);
  const langRef = useRef(lang);
  langRef.current = lang;
  const timers = useRef<number[]>([]);
  const cancelled = useRef(false);

  useEffect(() => {
    flowsRef.current = flows;
  }, [flows]);

  useEffect(() => {
    const timers_ = timers.current;
    return () => {
      cancelled.current = true;
      timers_.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const advance = (taskIdx: number) => {
      if (cancelled.current) return;
      const s = flowsRef.current[taskIdx];
      s.phase = ((s.phase + 1) % 6) as Phase;
      logsRef.current = [logFor(s, langRef.current), ...logsRef.current].slice(0, 5);
      setLogs(logsRef.current);
      setFocus(taskIdx);
      setFlows([...flowsRef.current]);
      const ms = PHASE_MS[s.phase];
      timers.current.push(window.setTimeout(() => advance(taskIdx), ms));
    };

    STAGGER_MS.forEach((ms, i) => {
      timers.current.push(window.setTimeout(() => advance(i), ms));
    });
    return () => {
      cancelled.current = true;
    };
  }, []);

  const focusFlow = flows[focus];
  const focusDevice = DEVICES[focusFlow.fromIdx];

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* desktop topology */}
      <div className="hidden flex-1 md:block">
        <svg viewBox="0 0 760 420" className="h-full w-full" role="img" aria-label="AXCrew multi-machine fleet with live task flow">
          {/* device → hub edges */}
          <g>
            {DEVICES.map((d, i) => {
              const y = DEV_Y[i];
              const active = flows.some((s) => (s.fromIdx === i && s.phase < 2) || (s.toIdx === i && s.phase >= 1 && s.phase <= 3));
              return (
                <line key={`d-${d.id}`} x1={186} y1={y} x2={292} y2={210} stroke={active ? 'var(--color-fog-2)' : 'var(--color-line-dark)'} strokeWidth={active ? 1.5 : 1} />
              );
            })}
            {/* hub → ax edges */}
            {AX_NODES.map((id, i) => {
              const y = AX_Y[i];
              const active = flows.some((s) => s.toIdx === i && s.phase >= 1 && s.phase <= 3);
              return (
                <line key={`a-${id}`} x1={468} y1={210} x2={606} y2={y} stroke={active ? 'var(--color-fog-2)' : 'var(--color-line-dark)'} strokeWidth={active ? 1.5 : 1} />
              );
            })}
          </g>

          {/* device nodes */}
          <g>
            {DEVICES.map((d, i) => {
              const y = DEV_Y[i];
              const active = flows.some((s) => (s.fromIdx === i && s.phase < 2) || (s.toIdx === i && s.phase >= 1 && s.phase <= 3));
              const yBox = y - 19;
              return (
                <g key={d.id}>
                  <rect x={35} y={yBox} width={150} height={38} fill="var(--color-void)" stroke={active ? 'var(--color-fog)' : 'var(--color-line-dark)'} />
                  <circle cx={50} cy={y - 1} r={3} fill={active ? 'var(--color-ok)' : 'var(--color-line-dark-2)'} className={active ? 'pulse' : ''} />
                  <text x={62} y={y - 6} fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-fog)">{d.name[lang]}</text>
                  <text x={62} y={y + 8} fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-fog-2)">{d.detail[lang]}</text>
                  <text x={150} y={y - 6} textAnchor="end" fontFamily="var(--font-mono)" fontSize="9" fill={active ? 'var(--color-ok)' : 'var(--color-fog-2)'}>{d.latency}</text>
                </g>
              );
            })}
          </g>

          {/* hub */}
          <g>
            <rect x={292} y={181} width={176} height={58} fill="var(--color-void-2)" stroke="var(--color-fog)" strokeWidth={1} />
            <text x={380} y={206} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fontWeight="500" fill="var(--color-fog)">AXCrew</text>
            <text x={380} y={224} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-fog-2)">control plane · gateway</text>
          </g>

          {/* ax nodes */}
          <g>
            {AX_NODES.map((id, i) => {
              const y = AX_Y[i];
              const busy = flows.some((s) => s.toIdx === i && s.phase === 2);
              const active = flows.some((s) => s.toIdx === i && s.phase >= 1 && s.phase <= 3);
              const yBox = y - 20;
              return (
                <g key={id}>
                  <rect x={606} y={yBox} width={88} height={40} fill="var(--color-void)" stroke={busy ? 'var(--color-ok)' : active ? 'var(--color-fog)' : 'var(--color-line-dark)'} />
                  <circle cx={618} cy={y - 1} r={2.5} fill={busy ? 'var(--color-ok)' : 'var(--color-line-dark-2)'} className={busy ? 'pulse' : ''} />
                  <text x={628} y={y + 4} fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-fog)">{id}</text>
                  <text x={628} y={y + 15} fontFamily="var(--font-mono)" fontSize="8" fill="var(--color-fog-2)">{nodeState(busy ? 'busy' : active ? 'working' : 'idle', lang)}</text>
                </g>
              );
            })}
          </g>

          {/* task packets — CSS-transitioned between phase targets */}
          <g>
            {flows.map((s) => {
              const to = dotTarget(s);
              const moving = s.phase === 0 || s.phase === 1 || s.phase === 3 || s.phase === 4;
              return (
                <circle
                  key={s.task.id}
                  cx={to.x}
                  cy={to.y}
                  r={3.5}
                  fill={s.phase === 2 ? 'var(--color-ok)' : s.phase === 5 ? 'var(--color-fog-2)' : 'var(--color-fog)'}
                  style={{
                    transition:
                      moving
                        ? `cx ${PHASE_MS[s.phase]}ms linear, cy ${PHASE_MS[s.phase]}ms linear`
                        : 'none',
                    transform: 'translateX(0)',
                  }}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* mobile: task-flow trace */}
      <div className="flex-1 md:hidden">
        <div className="hairline-dark-b bg-void-2 px-4 py-2">
          <span className="mono-micro text-fog-2">fleet · live</span>
        </div>
        <ul className="divide-y divide-line-dark border border-line-dark">
          {FLEET_TASKS.map((t, i) => {
            const s = flows[i];
            const target = DEVICES.find((d) => d.id === t.to)?.name[lang];
            const done = s.phase === 5;
            return (
              <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-2.5 font-mono text-xs">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.phase === 2 ? 'bg-ok pulse' : done ? 'bg-fog-2/50' : 'bg-fog'}`}></span>
                  <span className="text-fog">{t.id}</span>
                  <span className="truncate text-fog-2/80">{t.kind[lang]} → {target}</span>
                </span>
                <span className="shrink-0 text-fog-2">{done ? (lang === 'zh' ? '完成' : 'done') : s.phase === 2 ? (lang === 'zh' ? '运行中' : 'running') : phaseWord(s, lang)}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* live event ticker */}
      <div className="shrink-0">
        <div className="hairline-dark-b flex items-center justify-between bg-void-2 px-3.5 py-2">
          <span className="mono-micro text-fog-2">crew · live events</span>
          <span className="mono-micro text-ok">● streaming</span>
        </div>
        <ul className="panel-dark space-y-1 p-3.5">
          {logs.map((l, i) => (
            <li key={`${l}-${i}`} className="term truncate text-fog-2">
              {l}
            </li>
          ))}
        </ul>
      </div>

      {/* axcrew ps */}
      <div className="shrink-0 overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[0.6875rem] leading-relaxed">
          <tbody>
            {psTable(lang).map((row, i) => (
              <tr key={i} className={i === 0 ? 'text-fog-2' : 'text-fog-2/80'}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`whitespace-nowrap border-t border-line-dark px-3 py-1.5 first:pl-0 ${i > 0 && j === 1 ? 'text-ok' : ''} ${
                      i > 0 && j === 0 ? 'text-fog' : ''
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mono-micro mt-2 text-fog-2/60">$ axcrew ps --all · {DEVICES.length} devices · {FLEET_TASKS.length} in flight</p>
      </div>

      <p className="mono-micro hidden shrink-0 text-fog-2/60 md:block">
        {focusDevice.name[lang]} → {DEVICES[focusFlow.toIdx].name[lang]} · {focusFlow.task.id} · {phaseWord(focusFlow, lang)} · routed via ACP
      </p>
    </div>
  );
}
