import Link from 'next/link';

type BackProps = {
  href: string;
  className?: string;
};

export default function Back({ href, className }: BackProps) {
  const linkClassName = className ? `back-link ${className}` : 'back-link';

  return (
    <Link href={href} className={linkClassName} aria-label="Back">
      <span aria-hidden="true">←</span> Back
    </Link>
  );
}
