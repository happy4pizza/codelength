'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type ProviderId = 'openai' | 'google' | 'anthropic';

export type LlmPlayerConfig = {
  provider: ProviderId;
  model: string;
  apiKey: string;
};

export type LlmMatchConfig = {
  playerOne: LlmPlayerConfig;
  playerTwo: LlmPlayerConfig;
};

type LlmMatchConfigContextValue = {
  matchConfig: LlmMatchConfig | null;
  setMatchConfig: (config: LlmMatchConfig) => void;
};

const LlmMatchConfigContext = createContext<
  LlmMatchConfigContextValue | undefined
>(undefined);

type LlmMatchConfigProviderProps = {
  children: ReactNode;
};

export function LlmMatchConfigProvider({
  children,
}: LlmMatchConfigProviderProps) {
  const [matchConfig, setMatchConfigState] = useState<LlmMatchConfig | null>(
    null
  );

  const setMatchConfig = (config: LlmMatchConfig) => {
    setMatchConfigState(config);
  };

  const value = useMemo(
    () => ({
      matchConfig,
      setMatchConfig,
    }),
    [matchConfig]
  );

  return (
    <LlmMatchConfigContext.Provider value={value}>
      {children}
    </LlmMatchConfigContext.Provider>
  );
}

export function useLlmMatchConfig(): LlmMatchConfigContextValue {
  const context = useContext(LlmMatchConfigContext);
  if (!context) {
    throw new Error(
      'useLlmMatchConfig must be used within LlmMatchConfigProvider'
    );
  }
  return context;
}
