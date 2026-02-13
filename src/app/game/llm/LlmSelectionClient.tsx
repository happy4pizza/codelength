'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ProviderId, useLlmMatchConfig } from './LlmMatchConfigContext';

type ModelOption = {
  value: string;
  label: string;
};

type PlayerSlot = 'playerOne' | 'playerTwo';

type PlayerSelection = {
  provider: ProviderId;
  model: string;
  apiKey: string;
};

type PlayerSelections = Record<PlayerSlot, PlayerSelection>;

const PLAYER_SECTIONS: Array<{
  slot: PlayerSlot;
  title: string;
  placeholder: string;
}> = [
  {
    slot: 'playerOne',
    title: 'Player 1',
    placeholder: 'Enter Player 1 key',
  },
  {
    slot: 'playerTwo',
    title: 'Player 2',
    placeholder: 'Enter Player 2 key',
  },
];

const PROVIDER_OPTIONS: Array<{ value: ProviderId; label: string }> = [
  { value: 'openai', label: 'OpenAI (ChatGPT)' },
  { value: 'google', label: 'Google (Gemini)' },
  { value: 'anthropic', label: 'Anthropic (Claude)' },
];

const MODELS_BY_PROVIDER: Record<ProviderId, ModelOption[]> = {
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4.1', label: 'GPT-4.1' },
    { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
  ],
  google: [
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
  ],
  anthropic: [
    { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
    { value: 'claude-3-5-haiku', label: 'Claude 3.5 Haiku' },
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
  ],
};

export default function LlmSelectionClient() {
  const router = useRouter();
  const { setMatchConfig } = useLlmMatchConfig();
  const [selections, setSelections] = useState<PlayerSelections>({
    playerOne: {
      provider: 'openai',
      model: 'gpt-4o',
      apiKey: '',
    },
    playerTwo: {
      provider: 'openai',
      model: 'gpt-4.1',
      apiKey: '',
    },
  });

  const setProvider = (slot: PlayerSlot, provider: ProviderId) => {
    const firstModel = MODELS_BY_PROVIDER[provider]?.[0]?.value ?? '';
    setSelections((current) => ({
      ...current,
      [slot]: {
        ...current[slot],
        provider,
        model: firstModel,
      },
    }));
  };

  const setModel = (slot: PlayerSlot, model: string) => {
    setSelections((current) => ({
      ...current,
      [slot]: {
        ...current[slot],
        model,
      },
    }));
  };

  const setApiKey = (slot: PlayerSlot, apiKey: string) => {
    setSelections((current) => ({
      ...current,
      [slot]: {
        ...current[slot],
        apiKey,
      },
    }));
  };

  const onContinue = () => {
    const trimmedPlayerOneApiKey = selections.playerOne.apiKey.trim();
    const trimmedPlayerTwoApiKey = selections.playerTwo.apiKey.trim();
    if (!trimmedPlayerOneApiKey || !trimmedPlayerTwoApiKey) {
      return;
    }

    setMatchConfig({
      playerOne: {
        provider: selections.playerOne.provider,
        model: selections.playerOne.model,
        apiKey: trimmedPlayerOneApiKey,
      },
      playerTwo: {
        provider: selections.playerTwo.provider,
        model: selections.playerTwo.model,
        apiKey: trimmedPlayerTwoApiKey,
      },
    });

    router.push('/game/llm/play');
  };

  const canContinue =
    selections.playerOne.apiKey.trim() !== '' &&
    selections.playerTwo.apiKey.trim() !== '';

  return (
    <div className="theme-page theme-center">
      <div className="theme-shell theme-stack">
        <h1 className="theme-title">
          Please select each player&apos;s provider, model, and API key
        </h1>

        <div className="theme-grid-two">
          {PLAYER_SECTIONS.map((section) => (
            <div key={section.slot} className="theme-panel theme-panel-content">
              <h2 className="theme-heading">{section.title}</h2>

              <label
                htmlFor={`${section.slot}-provider`}
                className="theme-label"
              >
                Provider
              </label>
              <select
                id={`${section.slot}-provider`}
                value={selections[section.slot].provider}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setProvider(section.slot, e.target.value as ProviderId)
                }
                className="theme-control"
              >
                {PROVIDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <label htmlFor={`${section.slot}-model`} className="theme-label">
                Model
              </label>
              <select
                id={`${section.slot}-model`}
                value={selections[section.slot].model}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setModel(section.slot, e.target.value)
                }
                className="theme-control"
              >
                {MODELS_BY_PROVIDER[selections[section.slot].provider].map(
                  (option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  )
                )}
              </select>

              <label
                htmlFor={`${section.slot}-api-key`}
                className="theme-label"
              >
                API Key
              </label>
              <input
                id={`${section.slot}-api-key`}
                type="password"
                placeholder={section.placeholder}
                value={selections[section.slot].apiKey}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setApiKey(section.slot, e.target.value)
                }
                className="theme-control"
              />
            </div>
          ))}
        </div>

        <p className="theme-note">
          Tip: Don&apos;t commit keys to git. Use environment variables for real
          deployments.
        </p>

        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="theme-button theme-button-block"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
