import { useRef, useState } from 'react';
import { AFTER_INSTALL, INSTALL } from '../../lib/site';

const TABS = [
  { id: 'unix', label: 'macOS / Linux', cmd: INSTALL.unix },
  { id: 'windows', label: 'Windows', cmd: INSTALL.windows },
  { id: 'docker', label: 'Docker', cmd: INSTALL.docker },
  { id: 'npm', label: 'npm', cmd: INSTALL.npm },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function InstallCommand() {
  const [tab, setTab] = useState<TabId>('unix');
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement | null>(null);
  const active = TABS.find((t) => t.id === tab) ?? TABS[0];

  const copy = async () => {
    if (!preRef.current) return;
    try {
      await navigator.clipboard.writeText(preRef.current.textContent ?? '');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="panel-dark grid-bg">
      <div className="hairline-dark-b flex flex-wrap items-center justify-between gap-3 bg-void-2 px-3.5 py-2">
        <div className="flex flex-wrap items-center gap-5" role="tablist" aria-label="Install platform">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`mono-micro cursor-pointer transition-colors duration-200 ${
                tab === t.id ? 'text-fog' : 'text-fog-2 hover:text-fog'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => void copy()}
          className="mono-micro cursor-pointer text-fog-2 transition-colors duration-150 hover:text-fog"
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <pre ref={preRef} className="term overflow-x-auto text-fog">
          <code>
            <span className="text-fog-2">$ </span>
            {active.cmd}
          </code>
        </pre>

        <div className="hairline-dark-t mt-4 pt-4">
          {AFTER_INSTALL.map((c) => (
            <p key={c} className="term truncate text-fog-2">
              <span className="text-fog">$ </span>
              {c}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
