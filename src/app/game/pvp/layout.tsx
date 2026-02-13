import Back from '@/components/Back';
import type { ReactNode } from 'react';

type PvpLayoutProps = {
  children: ReactNode;
};

export default function PvpLayout({ children }: PvpLayoutProps) {
  return (
    <>
      <Back href="/" />
      {children}
    </>
  );
}
