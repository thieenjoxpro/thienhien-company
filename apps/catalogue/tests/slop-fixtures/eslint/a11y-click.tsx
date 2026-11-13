// expect: jsx-a11y/click-events-have-key-events
export function Fixture({ onPick }: { onPick: () => void }) {
  return <div onClick={onPick}>Bản lề cối 16 ly</div>;
}
