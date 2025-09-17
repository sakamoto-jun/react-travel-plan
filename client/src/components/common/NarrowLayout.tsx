import clsx from "clsx";
import type { PropsWithChildren } from "react";

interface NarrowLayoutProps {
  className?: string;
}

const NarrowLayout = ({
  className,
  children,
}: PropsWithChildren<NarrowLayoutProps>) => {
  return (
    <div className={clsx("w-full max-w-[685px] mx-auto px-15", className)}>
      {children}
    </div>
  );
};

export default NarrowLayout;
