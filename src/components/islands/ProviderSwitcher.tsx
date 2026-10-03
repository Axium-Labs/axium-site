import { useState } from 'react';

/**
 * Multi-provider switcher — same runtime, different model backend.
 * Grounded in providers.md: `--provider` / `--model` flags, credential
 * environment variables, OAuth device flow for Codex and WorkBuddy login.
 */

const PROVIDERS = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    protocol: 'Chat Completions',
    credential: 'DEEPSEEK_API_KEY',
    model: 'deepseek-chat',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    protocol: 'Responses API',
    credential: 'OPENAI_API_KEY',
    model: 'gpt-4.1',
  },
  {
    id: 'groq',
    name: 'Groq',
    protocol: 'Chat Completions · compatible',
    credential: 'GROQ_API_KEY',
    model: '— catalog —',
  },
  {
    id: 'codex',
    name: 'Codex',
    protocol: 'Codex Responses',
    credential: 'OAuth · device flow',
    model: '— catalog —',
  },
  {
    id: 'workbuddy',
    name: 'WorkBuddy',
    protocol: 'account login · OAuth',
    credential: 'ax auth login workbuddy',
    model: '— catalog —',
  },
] as const;

export default function ProviderSwitcher() {
  const [id, setId] = useState<(typeof PROVIDERS)[number]['id']>('deepseek');
  const active = PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="hairline border-line">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setId(p.id)}
            className={`flex w-full cursor-pointer items-baseline justify-between gap-4 border-b border-line px-4 py-3.5 text-left transition-colors duration-200 hover:bg-paper-2 sm:px-5 ${
              id === p.id ? 'bg-paper-2' : ''
            }`}
          >
            <span className="flex items-baseline gap-3">
              <span className="mono-micro tabular-nums">{String(PROVIDERS.indexOf(p) + 1).padStart(2, '0')}</span>
              <span className={`font-mono text-[0.8125rem] ${id === p.id ? 'text-ink' : 'text-ink-2'}`}>{p.name}</span>
            </span>
            <span className="datum hidden text-right sm:block">{p.protocol}</span>
          </button>
        ))}
        <p className="px-4 py-3 text-[0.8125rem] text-ink-3 sm:px-5">
          Add a local model by implementing <code className="font-mono text-xs">ModelProvider</code> — no agent-loop changes.
        </p>
      </div>

      <div className="panel-dark grid-bg">
        <div className="hairline-dark-b flex items-center justify-between bg-void-2 px-3.5 py-2">
          <span className="mono-micro text-fog-2">config · {active.name}</span>
          <span className="mono-micro text-fog-2">one runtime</span>
        </div>
        <div className="p-4">
          <pre className="term overflow-x-auto text-fog">
            <code>
              {`{ "provider": "${active.id}", "model": "${active.model}" }`}
            </code>
          </pre>
          <pre className="term mt-3 overflow-x-auto text-fog">
            <code>
              <span className="text-fog-2">$ </span>
              {`ax run --provider ${active.id} --model ${active.model.split(' ')[0]} "<task>"`}
            </code>
          </pre>
          <div className="hairline-dark-t mt-4 flex flex-wrap items-center justify-between gap-2 pt-3">
            <span className="mono-micro text-fog-2">{active.credential}</span>
            <span className="mono-micro text-fog-2">{active.protocol}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
