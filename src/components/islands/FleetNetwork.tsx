import { useEffect, useRef, useState } from 'react';
import { MACHINES, FLOW_STEPS, PHASE_SHORT } from '../../lib/topology';
import { pick, type Lang } from '../../lib/i18n';

/**
 * FleetNetwork v3 — a status panel, not a diagram.
 * One machine list on the left, the live task status on the right.
 * No boxes-in-a-row, no connector lines, no fake topology drawing.
 */

type Micro = 0 | 1 | 2 | 3 | 4 | 5;
const MICRO_MS: Record<Micro, number> = { 0: 1400, 1: 1400, 2: 2200, 3: 1400, 4: 1400, 5: 1200 };
const STEP_OF: Micro[] = [0, 0, 1, 2, 2, 3];

/** which machine is busy per micro-phase */
function busyNode(m: Micro): string | null {
  if (m === 2) return 'server';
  if (m === 0 || m === 1) return 'laptop';
  if (m === 3) return 'server';
  return null;
}

export default function FleetNetwork({ lang = 'en' }: { lang?: Lang }) {
  const [micro, setMicro] = useState<Micro>(5);
  const microRef = useRef<Micro>(5);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tick = () => {
      const next = ((microRef.current + 1) % 6) as Micro;
      microRef.current = next;
      setMicro(next);
      timer.current = setTimeout(tick, MICRO_MS[next]);
    };
    timer.current = setTimeout(tick, 900);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const step = FLOW_STEPS[STEP_OF[micro]];
  const phase = pick(PHASE_SHORT[step.phase], lang);
  const busy = busyNode(micro);
  const isExecuting = micro === 2;

  return (
    <div className="grid gap-px overflow-hidden border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-[1.15fr_1fr]">
      {/* machines */}
      <div className="bg-[var(--color-bg)]">
        <p className="mono-micro border-b border-[var(--color-border)] px-5 py-2.5">
          {lang === 'zh' ? '机器' : 'machines'}
        </p>
        <ul>
          {MACHINES.map((m) => {
            const active = busy === m.id;
            const executing = isExecuting && m.id === 'server';
            return (
              <li
                key={m.id}
                className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] px-5 py-3 last:border-b-0"
              >
                <span className="flex min-w-0 items-baseline gap-2.5">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                      executing
                        ? 'bg-[var(--color-ok)] pulse'
                        : active
                          ? 'bg-[var(--color-text-2)]'
                          : 'bg-[var(--color-border-strong)]'
                    }`}
                  />
                  <span
                    className={`truncate text-[0.875rem] transition-colors duration-200 ${
                      active || executing
                        ? 'text-[var(--color-text)]'
                        : 'text-[var(--color-text-2)]'
                    }`}
                  >
                    {m.name[lang]}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-[0.6875rem] text-[var(--color-text-3)]">
                  {m.detail[lang]}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* live status */}
      <div className="flex flex-col bg-[var(--color-bg-raised)]">
        <p className="mono-micro border-b border-[var(--color-border)] px-5 py-2.5">
          {lang === 'zh' ? '当前任务' : 'current task'}
        </p>

        <div className="flex flex-1 flex-col justify-between gap-4 p-5">
          <p className="font-mono text-[0.8125rem] leading-relaxed text-[var(--color-text)] break-words">
            ax run <span className="text-[var(--color-text-3)]">&ldquo;optimize the sort benchmark&rdquo;</span>
          </p>

          <div>
            <p className="font-mono text-[0.75rem] text-[var(--color-text-2)]">{step.label[lang]}</p>
            <p
              className={`mt-1.5 font-mono text-[0.75rem] font-medium ${
                isExecuting ? 'text-[var(--color-ok)]' : 'text-[var(--color-text-3)]'
              }`}
            >
              {phase}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
