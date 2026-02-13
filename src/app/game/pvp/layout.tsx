import type { ReactNode } from 'react';

type PvpLayoutProps = {
  children: ReactNode;
};

export default function PvpLayout({ children }: PvpLayoutProps) {
  return <>{children}</>;
}
