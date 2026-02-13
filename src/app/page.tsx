import ModeCard from '../components/ModeCard';

export default function Home() {
  return (
    <div className="theme-page theme-center">
      <div className="theme-shell theme-stack">
        <h1 className="theme-title">
          Welcome to codeLength{' '}
          <span className="animate-wave wave-emoji">👋</span>
        </h1>

        <div className="theme-inline-row">
          <ModeCard href="/game/llm" title="LLM" />
          <ModeCard href="/game/pvp" title="Player vs Player" />
        </div>
      </div>
    </div>
  );
}
