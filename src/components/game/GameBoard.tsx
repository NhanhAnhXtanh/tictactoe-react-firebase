import { type Cell, SIZE, type BoardCoord } from "../../services/gameLogic";

export default function GameBoard({
  board,
  onMove,
  lastMove,
  winningLine
}: {
  board: Cell[][];
  onMove: (r: number, c: number) => void;
  lastMove: { r: number; c: number; by: "X" | "O" } | null;
  winningLine?: BoardCoord[] | null;
}) {
  const winningSet = new Set(
    (winningLine ?? []).map(cell => `${cell.r}-${cell.c}`)
  );

  let lineSvg: { x1: number; y1: number; x2: number; y2: number } | null = null;
  if (winningLine && winningLine.length >= 2) {
    const first = winningLine[0];
    const last = winningLine[winningLine.length - 1];
    lineSvg = {
      x1: ((first.c + 0.5) / SIZE) * 100,
      y1: ((first.r + 0.5) / SIZE) * 100,
      x2: ((last.c + 0.5) / SIZE) * 100,
      y2: ((last.r + 0.5) / SIZE) * 100
    };
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-full flex justify-center">
        <div
          className="relative w-full"
          style={{ maxWidth: "min(90vw, 720px)", aspectRatio: "1 / 1" }}
        >
          <div className="absolute inset-0 bg-slate-100 border-4 border-slate-500 p-2 shadow-sm box-border rounded-md">
            <div
              className="h-full w-full grid"
              style={{
                gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
                gridAutoRows: "1fr"
              }}
            >
              {Array.from({ length: SIZE }).map((_, r) =>
                Array.from({ length: SIZE }).map((_, c) => {
                  const v = board?.[r]?.[c] ?? ".";
                  const isX = v === "X";
                  const isO = v === "O";
                  const isLast = lastMove && lastMove.r === r && lastMove.c === c;
                  const isWinning = winningSet.has(`${r}-${c}`);

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => onMove(r, c)}
                      className={`
                        relative flex items-center justify-center border border-slate-300 transition-colors w-full h-full
                        ${v === "." ? "cursor-pointer hover:bg-slate-200" : "cursor-not-allowed bg-white"}
                        ${isWinning ? "bg-emerald-100/70" : ""}
                      `}
                    >
                      {isX && (
                        <span className="flex items-center justify-center w-full h-full font-semibold text-blue-600 leading-none text-[clamp(0.95rem,4vw,1.6rem)] md:text-[clamp(1.1rem,2.5vw,1.9rem)]">
                          X
                        </span>
                      )}
                      {isO && (
                        <span className="flex items-center justify-center w-full h-full font-semibold text-red-500 leading-none text-[clamp(0.95rem,4vw,1.6rem)] md:text-[clamp(1.1rem,2.5vw,1.9rem)]">
                          O
                        </span>
                      )}
                      {isLast && (
                        <div className="absolute inset-0 ring-2 ring-emerald-500 ring-inset rounded-sm pointer-events-none" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
            {lineSvg && (
              <svg
                className="pointer-events-none absolute inset-2"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <line
                  x1={lineSvg.x1}
                  y1={lineSvg.y1}
                  x2={lineSvg.x2}
                  y2={lineSvg.y2}
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-600 text-center">
        <p>X: xanh dương • O: đỏ • 5 ký hiệu liên tiếp để thắng</p>
      </div>
    </div>
  );
}
