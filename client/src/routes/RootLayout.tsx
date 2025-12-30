import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Loading from "../components/common/Loading";

const RootLayout = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  );
};

export default RootLayout;
