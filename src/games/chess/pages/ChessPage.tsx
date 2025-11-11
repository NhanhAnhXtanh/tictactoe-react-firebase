import ChessBoard from "../components/ChessBoard";

export default function ChessPage() {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-wide text-indigo-600 font-semibold">Coming soon</p>
        <h1 className="text-3xl font-bold text-gray-900">Co vua online</h1>
        <p className="text-gray-600">Hang doi tinh nang dang duoc xay dung. Theo doi de thu nghiem som nhat.</p>
      </header>
      <ChessBoard />
    </section>
  );
}
