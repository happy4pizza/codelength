import GameScreen from '@/components/game/GameScreen';

export default function PvpPlayPage() {
  return (
    <GameScreen
      modeTitle="Player vs Player"
      playerOne={{ name: 'Player 1', subtitle: 'Human' }}
      playerTwo={{ name: 'Player 2', subtitle: 'Human' }}
      showPromptPanel={false}
    />
  );
}
