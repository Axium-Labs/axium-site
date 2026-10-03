import { useEffect, useRef, useState } from 'react';
import { AGENTS, BOOT, HELP, KIND_CLASS, MEM, RUN_TASK, STATUS, UNKNOWN, type TermLine } from '../../lib/terminal';

interface Props {
  /** auto-play the RUN_TASK script instead of accepting input */
  autoPlay?: boolean;
  /** allow typing (only when autoPlay is false) */
  interactive?: boolean;
}

const RESPONSES: Record<string, TermLine[]> = {
  help: HELP,
  status: STATUS,
  agents: AGENTS,
  mem: MEM,
};

const HINTS = 'help · status · agents · mem · run "<task>"';

export default function TerminalDemo({ autoPlay = false, interactive = !autoPlay }: Props) {
  const [lines, setLines] = useState<TermLine[]>(autoPlay ? [] : BOOT);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [promptOn, setPromptOn] = useState(!autoPlay);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);

  const schedule = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, promptOn]);

  useEffect(() => {
    const timers_ = timers.current;
    return () => timers_.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let i = 0;
    const tick = () => {
      if (i >= RUN_TASK.length) {
        setPromptOn(true);
        return;
      }
      const line = RUN_TASK[i];
      setLines((prev) => [...prev, line]);
      i += 1;
      schedule(tick, reduced ? 0 : 250);
    };
    schedule(tick, reduced ? 0 : 700);
  }, [autoPlay]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd || busy) return;
    setLines((prev) => [...prev, { kind: 'cmd', text: `ax> ${cmd}` }]);
    setInput('');
    setBusy(true);
    if (cmd === 'clear') {
      setLines([]);
      setBusy(false);
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const resp = cmd.startsWith('run ')
      ? RUN_TASK
      : RESPONSES[cmd] ?? UNKNOWN;
    let i = 0;
    const step = () => {
      if (i >= resp.length) {
        setBusy(false);
        return;
      }
      const line = resp[i];
      setLines((prev) => [...prev, line]);
      i += 1;
      schedule(step, reduced ? 0 : 75);
    };
    step();
  };

  return (
    <div className="term flex h-full min-h-0 flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {lines.map((l, i) =>
          l ? (
            <p key={i} className={`whitespace-pre-wrap break-words ${KIND_CLASS[l.kind]}`}>
              {l.text}
            </p>
          ) : null,
        )}
        {promptOn && (
          <form
            className="mt-1 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
            }}
          >
            <span className="shrink-0 text-fog">ax&gt;</span>
            {interactive ? (
              <input
                className="min-w-0 flex-1 bg-transparent text-fog caret-fog outline-none"
                value={input}
                spellCheck={false}
                autoComplete="off"
                aria-label="terminal input"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'l' && e.ctrlKey) {
                    e.preventDefault();
                    setLines([]);
                  }
                }}
              />
            ) : (
              <span className="cursor-blink text-fog">_</span>
            )}
          </form>
        )}
      </div>
      {interactive && !busy && <p className="mono-micro mt-3 shrink-0 text-fog-2/70">{HINTS}</p>}
    </div>
  );
}
