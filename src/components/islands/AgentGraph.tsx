import { useEffect, useRef, useState } from 'react';
import { GRAPH_EDGES, GRAPH_NODES, GRAPH_STEPS, type GraphNode } from '../../lib/graph';

/** one task → parallel subagents → tool rounds → memory, as a live graph */

const NODE_W: Record<string, number> = { input: 132, runtime: 170, child: 148, tool: 132, memory: 132 };
const NODE_H: Record<string, number> = { input: 40, runtime: 56, child: 50, tool: 46, memory: 46 };

function nodeState(node: GraphNode, step: number) {
  if (step < 0) return 'idle';
  if (step < node.activeStep) return 'idle';
  if (step === node.activeStep) return 'running';
  return 'done';
}

export default function AgentGraph() {
  const [step, setStep] = useState(-1);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const timers_ = timers.current;
    return () => timers_.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(GRAPH_STEPS.length - 1);
      return;
    }
    let cancelled = false;
    const STEP_MS = 860;
    const HOLD_MS = 2000;
    let s = 0;
    const cycle = () => {
      if (cancelled) return;
      setStep(s);
      s += 1;
      if (s > GRAPH_STEPS.length - 1) {
        timers.current.push(
          window.setTimeout(() => {
            if (!cancelled) {
              s = 0;
              cycle();
            }
          }, HOLD_MS),
        );
      } else {
        timers.current.push(window.setTimeout(cycle, STEP_MS));
      }
    };
    timers.current.push(window.setTimeout(cycle, 600));
    return () => {
      cancelled = true;
    };
  }, []);

  const activeStep = GRAPH_STEPS.find((st) => st.id === Math.max(0, step)) ?? GRAPH_STEPS[0];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="hidden flex-1 md:block">
        <svg viewBox="0 0 760 500" className="h-full w-full" role="img" aria-label="Agent task delegation graph">
          {/* edges */}
          <g>
            {GRAPH_EDGES.map((e) => {
              const from = GRAPH_NODES.find((n) => n.id === e.from)!;
              const to = GRAPH_NODES.find((n) => n.id === e.to)!;
              const y1 = from.y + NODE_H[from.kind] / 2;
              const y2 = to.y - NODE_H[to.kind] / 2;
              const state = step < 0 ? 'idle' : step < e.activeStep ? 'idle' : step === e.activeStep ? 'flow' : 'done';
              const cls = state === 'flow' ? 'edge-flow' : '';
              const stroke = state === 'idle' ? 'var(--color-line-dark)' : state === 'flow' ? 'var(--color-fog-2)' : 'var(--color-line-dark-2)';
              return (
                <line
                  key={e.id}
                  x1={from.x}
                  y1={y1}
                  x2={to.x}
                  y2={y2}
                  className={cls}
                  stroke={stroke}
                  strokeWidth={state === 'flow' ? 1.5 : 1}
                />
              );
            })}
          </g>
          {/* nodes */}
          <g>
            {GRAPH_NODES.map((n) => {
              const w = NODE_W[n.kind];
              const h = NODE_H[n.kind];
              const state = nodeState(n, step);
              const x = n.x - w / 2;
              const y = n.y - h / 2;
              const stroke = state === 'idle' ? 'var(--color-line-dark)' : state === 'running' ? 'var(--color-fog)' : 'var(--color-line-dark-2)';
              const dot = state === 'done' ? 'var(--color-ok)' : state === 'running' ? 'var(--color-fog)' : 'var(--color-line-dark-2)';
              return (
                <g key={n.id}>
                  <rect x={x} y={y} width={w} height={h} rx="0" fill={n.kind === 'runtime' ? 'var(--color-void-2)' : 'var(--color-void)'} stroke={stroke} />
                  <circle cx={x + 14} cy={n.y - 1} r="2.5" fill={dot} className={state === 'running' ? 'pulse' : ''} />
                  <text x={x + 26} y={n.y - 2} fontFamily="var(--font-mono)" fontSize="11" fill={state === 'idle' ? 'var(--color-fog-2)' : 'var(--color-fog)'}>
                    {n.label}
                  </text>
                  <text x={x + 26} y={n.y + 13} fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-fog-2)">
                    {n.sub}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* mobile: same data, vertical task trace */}
      <div className="flex-1 md:hidden">
        <ul className="divide-y divide-line-dark border border-line-dark">
          {GRAPH_STEPS.map((st) => {
            const glyph = step < 0 || step < st.id ? '○' : step === st.id ? '▸' : '✓';
            const cls = step < st.id ? 'text-fog-2/60' : step === st.id ? 'text-fog' : 'text-ok';
            return (
              <li className={`flex items-center justify-between px-4 py-3 font-mono text-xs ${cls}`}>
                <span>{st.name}</span>
                <span className="tabular-nums">
                  {glyph} 0{st.id + 1}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 flex shrink-0 items-center justify-between hairline-dark-t pt-3">
        <p className="mono-micro text-fog-2">
          step {Math.max(0, step) + 1}/{GRAPH_STEPS.length} · {activeStep.name}
        </p>
        <p className="mono-micro text-fog-2/70">auto · live</p>
      </div>
    </div>
  );
}
