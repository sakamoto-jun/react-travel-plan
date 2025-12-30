import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";

const RegisterCity = lazy(() => import("@/pages/admin/RegisterCity"));
const RegisterCountry = lazy(() => import("@/pages/admin/RegisterCountry"));
const RegisterPlace = lazy(() => import("@/pages/admin/RegisterPlace"));
const Home = lazy(() => import("@/pages/home/Home"));
const PlanCity = lazy(() => import("@/pages/plan/City"));
const Itinerary = lazy(() => import("@/pages/Itinerary/City"));

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/admin",
        children: [
          { path: "register-city", element: <RegisterCity /> },
          { path: "register-country", element: <RegisterCountry /> },
          { path: "register-place", element: <RegisterPlace /> },
        ],
      },
      { path: "/", element: <Home /> },
      { path: "/plan/:city", element: <PlanCity /> },
      { path: "/itinerary/:city", element: <Itinerary /> },
    ],
  },
]);

export default router;
