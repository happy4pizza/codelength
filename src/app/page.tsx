import ModeCard from '../components/ModeCard';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-center text-[48px] font-bold leading-tight text-black dark:text-zinc-50">
          Welcome to codeLength{' '}
          <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
        </h1>

        <div className="flex gap-4">
          <ModeCard href="/game/llm" title="LLM" />
          <ModeCard href="/game/pvp" title="Player vs Player" />
        </div>
      </div>
    </div>
  );
}
