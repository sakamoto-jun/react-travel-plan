import Loading from "@/components/common/Loading";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const RegisterCity = lazy(() => import("@/pages/admin/RegisterCity"));

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
    ],
  },
]);

export default router;
