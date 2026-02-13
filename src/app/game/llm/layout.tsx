import type { ReactNode } from 'react';
import { LlmMatchConfigProvider } from './LlmMatchConfigContext';

type LlmLayoutProps = {
  children: ReactNode;
};

export default function LlmLayout({ children }: LlmLayoutProps) {
  return <LlmMatchConfigProvider>{children}</LlmMatchConfigProvider>;
}
