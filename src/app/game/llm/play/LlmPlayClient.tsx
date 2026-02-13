'use client';

import Link from 'next/link';
import GameScreen from '@/components/game/GameScreen';
import { useLlmMatchConfig } from '../LlmMatchConfigContext';

const PROVIDER_LABELS = {
  openai: 'OpenAI',
  google: 'Google (Gemini)',
  anthropic: 'Anthropic (Claude)',
} as const;

export default function LlmPlayClient() {
  const { matchConfig } = useLlmMatchConfig();

  if (!matchConfig) {
    return (
      <div className="theme-page theme-center">
        <div className="theme-shell">
          <div className="theme-panel theme-panel-content theme-stack">
            <h1 className="theme-heading">Missing setup</h1>
            <p className="theme-subtitle">
              Please configure both players before starting the LLM game.
            </p>
            <Link href="/game/llm" className="theme-button">
              Back To LLM Setup
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GameScreen
      modeTitle="LLM Game"
      playerOne={{
        name: 'Player 1',
        subtitle: `${PROVIDER_LABELS[matchConfig.playerOne.provider]} • ${matchConfig.playerOne.model}`,
      }}
      playerTwo={{
        name: 'Player 2',
        subtitle: `${PROVIDER_LABELS[matchConfig.playerTwo.provider]} • ${matchConfig.playerTwo.model}`,
      }}
      showPromptPanel
      prompts={[
        {
          player: 'Player 1 Prompt',
          prompt: `You are ${matchConfig.playerOne.model}. Play strategically and justify each move briefly.`,
        },
        {
          player: 'Player 2 Prompt',
          prompt: `You are ${matchConfig.playerTwo.model}. Counter the opponent and prioritize winning lines.`,
        },
      ]}
    />
  );
}
