// expect: better-tailwindcss/no-restricted-classes
// expect-message: hover:scale-105
export function Fixture() {
  return <div className="hover:scale-105">Bản lề cối 16 ly</div>;
}
