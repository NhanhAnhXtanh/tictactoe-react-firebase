import type { RouteObject } from "react-router-dom";

export interface GameModule {
  slug: string;
  name: string;
  description: string;
  comingSoon?: boolean;
  routes: RouteObject[];
}
