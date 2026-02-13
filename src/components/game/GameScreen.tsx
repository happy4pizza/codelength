'use client';

type PlayerInfo = {
  name: string;
  subtitle: string;
};

type PromptInfo = {
  player: string;
  prompt: string;
};

type GameScreenProps = {
  modeTitle: string;
  playerOne: PlayerInfo;
  playerTwo: PlayerInfo;
  showPromptPanel: boolean;
  prompts?: PromptInfo[];
};

export default function GameScreen({
  modeTitle,
  playerOne,
  playerTwo,
  showPromptPanel,
  prompts = [],
}: GameScreenProps) {
  return (
    <main className="theme-page theme-center">
      <div className="theme-shell theme-stack">
        <h1 className="theme-title">{modeTitle}</h1>

        <p className="theme-subtitle">
          {playerOne.name}: {playerOne.subtitle}
        </p>
        <p className="theme-subtitle">
          {playerTwo.name}: {playerTwo.subtitle}
        </p>

        {showPromptPanel && (
          <section className="theme-panel theme-panel-content">
            <h2 className="theme-heading">Prompts</h2>
            {prompts.map((promptItem, index) => (
              <p
                key={`${promptItem.player}-${index}`}
                className="theme-subtitle"
              >
                {promptItem.player}: {promptItem.prompt}
              </p>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
