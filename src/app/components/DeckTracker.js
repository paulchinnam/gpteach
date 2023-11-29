export default function DeckTracker({ deckLength }) {
  const cards = Array.from({ length: deckLength }, (_, index) => (
    <div key={index} className="bg-blue-200 rounded-full w-3 h-3"></div>
  ));
  return (
    <>
      <div className="flex gap-4">{cards}</div>
    </>
  );
}
