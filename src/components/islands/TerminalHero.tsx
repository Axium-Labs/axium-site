import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../../lib/i18n';

/**
 * TerminalHero — an animated terminal that types through real AX commands.
 * Pauses between lines, shows a blinking cursor, loops.
 */

const SESSIONS: { cmd: string; out: string[] }[] = [
  {
    cmd: 'ax run "refactor the auth module"',
    out: [
      '▸ reading src/auth/mod.rs',
      '▸ planning refactor',
      '▸ edit src/auth/mod.rs  +42 −18',
      '▸ edit src/auth/tests.rs +12',
      '✓ done  ·  session saved',
    ],
  },
  {
    cmd: 'ax run "find all TODO comments and fix them"',
    out: [
      '▸ glob **/*.rs  →  14 files',
      '▸ found 7 TODOs',
      '▸ edit src/lib.rs',
      '▸ edit src/core/loop.rs',
      '✓ done  ·  7 resolved',
    ],
  },
  {
    cmd: 'ax crew pair ABC123 --gateway https://crew.local',
    out: [
      '▸ Ed25519 challenge …',
      '▸ paired  ·  outbound WSS',
      '✓ laptop added to fleet',
    ],
  },
];

const CHAR_MS = 28;
const LINE_PAUSE = 320;
const DONE_PAUSE = 2200;
const RESET_PAUSE = 600;

export default function TerminalHero({ lang = 'en' }: { lang?: Lang }) {
  const [sessionIdx, setSessionIdx] = useState(0);
  const [cmd, setCmd] = useState('');
  const [lines, setLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<'typing' | 'output' | 'done'>('typing');
  const [outputIdx, setOutputIdx] = useState(0);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const s = SESSIONS[0];
      setCmd(s.cmd);
      setLines(s.out);
      setPhase('done');
      return;
    }

    cancelRef.current = false;
    const session = SESSIONS[sessionIdx % SESSIONS.length];

    let charIdx = 0;
    setCmd('');
    setLines([]);
    setPhase('typing');
    setOutputIdx(0);

    // type the command
    const typeChar = () => {
      if (cancelRef.current) return;
      if (charIdx < session.cmd.length) {
        setCmd(session.cmd.slice(0, charIdx + 1));
        charIdx++;
        setTimeout(typeChar, CHAR_MS + Math.random() * 18);
      } else {
        // start output
        setTimeout(() => showLine(0), LINE_PAUSE);
      }
    };

    const showLine = (idx: number) => {
      if (cancelRef.current) return;
      if (idx < session.out.length) {
        setLines(session.out.slice(0, idx + 1));
        setOutputIdx(idx);
        setTimeout(() => showLine(idx + 1), LINE_PAUSE + Math.random() * 180);
      } else {
        setPhase('done');
        setTimeout(() => {
          if (!cancelRef.current) {
            setSessionIdx((s) => s + 1);
          }
        }, DONE_PAUSE);
      }
    };

    const t = setTimeout(typeChar, RESET_PAUSE);
    return () => {
      cancelRef.current = true;
      clearTimeout(t);
    };
  }, [sessionIdx]);

  const session = SESSIONS[sessionIdx % SESSIONS.length];

  return (
    <div className="font-mono text-[0.8125rem] leading-relaxed">
      {/* prompt line */}
      <div className="flex items-start gap-2">
        <span style={{ color: 'var(--color-void-text-2)' }}>$</span>
        <span style={{ color: 'var(--color-void-text)' }}>
          {cmd}
          {phase === 'typing' && (
            <span
              className="inline-block w-[2px] h-[1.1em] align-middle ml-[1px] cursor-blink"
              style={{ background: 'var(--color-void-text-2)' }}
            />
          )}
        </span>
      </div>

      {/* output lines */}
      {lines.map((line, i) => {
        const isDone = line.startsWith('✓');
        const isStep = line.startsWith('▸');
        return (
          <div
            key={`${sessionIdx}-${i}`}
            className="mt-1 pl-4 transition-all duration-200"
            style={{
              color: isDone
                ? 'var(--color-accent-muted)'
                : isStep
                ? 'var(--color-void-text-2)'
                : 'var(--color-void-text)',
              opacity: 1,
            }}
          >
            {line}
          </div>
        );
      })}

      {/* cursor after output */}
      {phase !== 'typing' && lines.length === session.out.length && (
        <div className="mt-1 flex items-start gap-2 pl-0">
          <span style={{ color: 'var(--color-void-text-2)' }}>$</span>
          <span
            className="inline-block w-[2px] h-[1.1em] align-middle cursor-blink"
            style={{ background: 'var(--color-void-text-2)' }}
          />
        </div>
      )}
    </div>
  );
}
