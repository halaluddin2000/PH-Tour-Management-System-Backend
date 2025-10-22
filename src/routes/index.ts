import { Router } from "express";
import { UserRoutes } from "../app/modules/user/user.route";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { DivisionRoutes } from "../app/modules/division/division.route";
import { TourRoutes } from "../app/modules/tour/tour.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    router: UserRoutes,
  },
  {
    path: "/auth",
    router: AuthRoutes,
  },
  {
    path: "/division",
    router: DivisionRoutes,
  },
  {
    path: "/tour",
    router: TourRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.router);
});
