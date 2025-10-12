import Loading from "@/components/common/Loading";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const RegisterCity = lazy(() => import("@/pages/admin/RegisterCity"));
const RegisterCountry = lazy(() => import("@/pages/admin/RegisterCountry"));
const Home = lazy(() => import("@/pages/home/Home"));
const PlanCity = lazy(() => import("@/pages/plan/City"));

const router = createBrowserRouter([
  {
    path: "/admin",
    children: [
      {
        path: "register-city",
        element: (
          <Suspense fallback={<Loading />}>
            <RegisterCity />
          </Suspense>
        ),
      },
      {
        path: "register-country",
        element: (
          <Suspense fallback={<Loading />}>
            <RegisterCountry />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/plan/:city",
    element: (
      <Suspense fallback={<Loading />}>
        <PlanCity />
      </Suspense>
    ),
  },
]);

export default router;
