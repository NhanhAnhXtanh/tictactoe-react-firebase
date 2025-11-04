// src/services/gameLogic.ts
export type Cell = "." | "X" | "O";
export const SIZE = 20;
export const WIN = 5;

export function emptyBoard(): Cell[][] {
  return Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => "." as Cell)
  );
}

export interface BoardCoord {
  r: number;
  c: number;
}

function inBounds(r: number, c: number) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

const DIRS: Array<[number, number]> = [
  [0, 1],   // ngang
  [1, 0],   // dọc
  [1, 1],   // chéo xuôi
  [1, -1],  // chéo ngược
];

export function findWinningLine(
  board: Cell[][],
  r: number,
  c: number,
  me: Cell
): BoardCoord[] | null {
  if (board?.[r]?.[c] !== me) return null;

  for (const [dr, dc] of DIRS) {
    const cells: BoardCoord[] = [{ r, c }];

    let rr = r + dr;
    let cc = c + dc;
    while (inBounds(rr, cc) && board[rr][cc] === me) {
      cells.push({ r: rr, c: cc });
      rr += dr;
      cc += dc;
    }

    rr = r - dr;
    cc = c - dc;
    while (inBounds(rr, cc) && board[rr][cc] === me) {
      cells.unshift({ r: rr, c: cc });
      rr -= dr;
      cc -= dc;
    }

    if (cells.length >= WIN) return cells;
  }

  return null;
}

export function checkWin(board: Cell[][], r: number, c: number, me: Cell): boolean {
  return findWinningLine(board, r, c, me) !== null;
}
