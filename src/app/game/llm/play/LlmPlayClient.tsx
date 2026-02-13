'use client';

import Link from 'next/link';
import SpinDial from '@/components/game/SpinDial';
import { useLlmMatchConfig } from '../LlmMatchConfigContext';

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
    <main className="theme-page theme-center spin-page">
      <SpinDial />
    </main>
  );
}
