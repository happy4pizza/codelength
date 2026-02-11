import Link from 'next/link';

type ModeCardProps = {
  href: string;
  title: string;
};

export default function ModeCard({ href, title }: ModeCardProps) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
    >
      {title}
    </Link>
  );
}
