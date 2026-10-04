import { useEffect, useRef, useState } from 'react';
import { AX_NODES, FLOW_STEPS, MACHINES, PHASE_SHORT } from '../../lib/topology';
import { pick, type Lang } from '../../lib/i18n';

/**
 * FleetNetwork — the signature visual: machines you own (each running AX)
 * around the AXCrew control plane, with ONE task travelling the fleet:
 * laptop asks → AXCrew routes → a machine executes → the result returns.
 *
 * No fake latency, no task ids, no telemetry decoration. A single packet
 * cycles route → execute → return → done; CSS transitions move it between
 * phase targets, so rendering happens only on phase changes
 * (prefers-reduced-motion safe).
 */

const DEV_Y = [66, 138, 210, 282];
const AX_Y = [110, 196, 282, 368];
const HUB_LEFT = { x: 292, y: 210 };
const HUB_RIGHT = { x: 468, y: 210 };

/** the machine that runs the work in this scene (build · linux) */
const EXEC_AX = 1;

/** micro-phases: laptop→hub, hub→ax, execute, ax→hub, hub→laptop, done */
type Micro = 0 | 1 | 2 | 3 | 4 | 5;

const MICRO_MS: Record<Micro, number> = { 0: 1300, 1: 1300, 2: 2600, 3: 1300, 4: 1300, 5: 1500 };

function microTarget(p: Micro): { x: number; y: number } {
  switch (p) {
    case 0:
      return HUB_LEFT;
    case 1:
      return { x: 606, y: AX_Y[EXEC_AX] };
    case 2:
      return { x: 606, y: AX_Y[EXEC_AX] };
    case 3:
      return HUB_RIGHT;
    case 4:
      return { x: 186, y: DEV_Y[0] };
    case 5:
      return { x: 186, y: DEV_Y[0] };
  }
}

/** which FLOW_STEPS entry a micro-phase belongs to */
const STEP_OF: Micro[] = [0, 0, 1, 2, 2, 3];

/** edges highlighted per micro-phase */
function edgeActive(p: Micro, edge: 'd0-hub' | 'hub-ax' | 'ax-hub' | 'hub-d0'): boolean {
  switch (p) {
    case 0:
      return edge === 'd0-hub';
    case 1:
      return edge === 'hub-ax';
    case 3:
      return edge === 'ax-hub';
    case 4:
      return edge === 'hub-d0';
    default:
      return false;
  }
}

export default function FleetNetwork({ lang = 'en' }: { lang?: Lang }) {
  const [micro, setMicro] = useState<Micro>(4);
  const microRef = useRef<Micro>(4);
  const timer = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tick = () => {
      const next = ((microRef.current + 1) % 6) as Micro;
      microRef.current = next;
      setMicro(next);
      timer.current = window.setTimeout(tick, MICRO_MS[next]);
    };
    timer.current = window.setTimeout(tick, 800);
    return () => window.clearTimeout(timer.current);
  }, []);

  const step = FLOW_STEPS[STEP_OF[micro]];
  const phase = pick(PHASE_SHORT[step.phase], lang);
  const from = MACHINES.find((m) => m.id === step.from)?.name[lang] ?? '';
  const to = MACHINES.find((m) => m.id === step.to)?.name[lang] ?? '';
  const target = microTarget(micro);
  const moving = micro === 0 || micro === 1 || micro === 3 || micro === 4;
  const executing = micro === 2;

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      {/* desktop topology */}
      <div className="hidden flex-1 md:block">
        <svg viewBox="0 0 760 400" className="h-auto w-full" role="img" aria-label="AX and AXCrew multi-machine network with a task travelling the fleet">
          {/* edges: laptop ↔ hub, hub ↔ ax nodes */}
          <g>
            <line x1={186} y1={DEV_Y[0]} x2={292} y2={210} stroke={edgeActive(micro, 'd0-hub') ? 'var(--color-fog-2)' : 'var(--color-line-dark)'} strokeWidth={edgeActive(micro, 'd0-hub') ? 1.5 : 1} />
            <line x1={186} y1={DEV_Y[3]} x2={292} y2={210} stroke="var(--color-line-dark)" strokeWidth={1} />
            {AX_NODES.map((id, i) => {
              const y = AX_Y[i];
              const active = edgeActive(micro, 'hub-ax') && i === EXEC_AX;
              const back = edgeActive(micro, 'ax-hub') && i === EXEC_AX;
              return (
                <line
                  key={`a-${id}`}
                  x1={468}
                  y1={210}
                  x2={606}
                  y2={y}
                  stroke={active || back ? 'var(--color-fog-2)' : 'var(--color-line-dark)'}
                  strokeWidth={active || back ? 1.5 : 1}
                />
              );
            })}
          </g>

          {/* machines (left) */}
          <g>
            {MACHINES.map((m, i) => {
              const y = DEV_Y[i];
              const lit = i === 0 ? micro === 4 || micro === 5 || micro === 0 : false;
              const yBox = y - 19;
              return (
                <g key={m.id}>
                  <rect x={35} y={yBox} width={150} height={38} fill="var(--color-void)" stroke={lit ? 'var(--color-fog)' : 'var(--color-line-dark)'} />
                  <circle cx={50} cy={y - 1} r={3} fill={lit ? 'var(--color-ok)' : 'var(--color-line-dark-2)'} className={lit ? 'pulse' : ''} />
                  <text x={62} y={y - 6} fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-fog)">{m.name[lang]}</text>
                  <text x={62} y={y + 8} fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-fog-2)">{m.detail[lang]}</text>
                </g>
              );
            })}
          </g>

          {/* AXCrew hub */}
          <g>
            <rect x={292} y={181} width={176} height={58} fill="var(--color-void-2)" stroke="var(--color-fog)" strokeWidth={1} />
            <text x={380} y={206} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fontWeight="500" fill="var(--color-fog)">AXCrew</text>
            <text x={380} y={224} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-fog-2)">control plane</text>
          </g>

          {/* AX nodes (right) */}
          <g>
            {AX_NODES.map((id, i) => {
              const y = AX_Y[i];
              const busy = executing && i === EXEC_AX;
              const lit = (micro === 1 || micro === 3) && i === EXEC_AX;
              const yBox = y - 20;
              return (
                <g key={id}>
                  <rect x={606} y={yBox} width={88} height={40} fill="var(--color-void)" stroke={busy ? 'var(--color-ok)' : lit ? 'var(--color-fog)' : 'var(--color-line-dark)'} />
                  <circle cx={618} cy={y - 1} r={2.5} fill={busy ? 'var(--color-ok)' : 'var(--color-line-dark-2)'} className={busy ? 'pulse' : ''} />
                  <text x={628} y={y + 4} fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-fog)">{id}</text>
                  <text x={628} y={y + 15} fontFamily="var(--font-mono)" fontSize="8" fill="var(--color-fog-2)">{i === EXEC_AX ? (executing ? (lang === 'zh' ? '执行中' : 'working') : 'ax') : 'ax'}</text>
                </g>
              );
            })}
          </g>

          {/* the one task packet */}
          <circle
            cx={target.x}
            cy={target.y}
            r={3.5}
            fill={executing ? 'var(--color-ok)' : micro === 5 ? 'var(--color-fog-2)' : 'var(--color-fog)'}
            style={{
              transition: moving ? `cx ${MICRO_MS[micro]}ms linear, cy ${MICRO_MS[micro]}ms linear` : 'none',
            }}
          />
        </svg>
      </div>

      {/* status line — the only telemetry on the page */}
      <div className="hairline-dark-t bg-void-2 px-4 py-2.5">
        <p className="term truncate text-fog-2">
          <span className="text-fog">{from}</span>
          <span className="text-fog-2"> → </span>
          <span className="text-fog">{to}</span>
          <span className="text-fog-2"> · {step.label[lang]} · </span>
          <span className={executing ? 'text-ok' : 'text-fog-2'}>{phase}</span>
        </p>
      </div>

      {/* mobile: the same journey, as a trace */}
      <div className="md:hidden">
        <ul className="divide-y divide-line-dark border border-line-dark">
          {FLOW_STEPS.map((s, i) => {
            const active = STEP_OF[micro] === i;
            const a = MACHINES.find((m) => m.id === s.from)?.name[lang] ?? '';
            const b = MACHINES.find((m) => m.id === s.to)?.name[lang] ?? '';
            return (
              <li key={i} className="flex items-center justify-between gap-3 px-4 py-2.5 font-mono text-xs">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? (s.phase === 'execute' ? 'bg-ok pulse' : 'bg-fog') : 'bg-line-dark-2'}`}></span>
                  <span className="truncate text-fog-2">
                    {a} → {b}
                  </span>
                </span>
                <span className={`shrink-0 ${active ? 'text-fog' : 'text-fog-2/70'}`}>{pick(PHASE_SHORT[s.phase], lang)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
