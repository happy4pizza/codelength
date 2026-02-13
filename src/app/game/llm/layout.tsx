import type { ReactNode } from 'react';
import { LlmMatchConfigProvider } from './LlmMatchConfigContext';
import Back from '@/components/Back';

type LlmLayoutProps = {
  children: ReactNode;
};

export default function LlmLayout({ children }: LlmLayoutProps) {
  return (
    <LlmMatchConfigProvider>
      <Back href="/" />
      {children}
    </LlmMatchConfigProvider>
  );
}
