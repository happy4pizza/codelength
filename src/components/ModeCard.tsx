import Link from 'next/link';

type ModeCardProps = {
  href: string;
  title: string;
};

export default function ModeCard({ href, title }: ModeCardProps) {
  return (
    <Link href={href} className="mode-card">
      {title}
    </Link>
  );
}
