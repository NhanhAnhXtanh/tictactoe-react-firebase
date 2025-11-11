import type { GameModule } from "../types";
import { CHESS_ROUTE_SEGMENT } from "./constants";
import ChessPage from "./pages/ChessPage";

export const chessGame: GameModule = {
  slug: CHESS_ROUTE_SEGMENT,
  name: "Co vua",
  description: "Chuan bi cho ban choi co vua truc tuyen.",
  comingSoon: true,
  routes: [
    {
      path: CHESS_ROUTE_SEGMENT,
      element: <ChessPage />
    }
  ]
};
