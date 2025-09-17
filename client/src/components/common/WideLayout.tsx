import clsx from "clsx";
import type { PropsWithChildren } from "react";

interface WideLayoutProps {
  className?: string;
}

const WideLayout = ({
  className,
  children,
}: PropsWithChildren<WideLayoutProps>) => {
  return <div className={clsx("w-full h-full", className)}>{children}</div>;
};

export default WideLayout;
