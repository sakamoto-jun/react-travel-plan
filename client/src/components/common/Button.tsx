import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary";
}

const Button = ({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      type="button"
      className={clsx(
        "flex items-center justify-center py-14 rounded-6 text-16 font-medium",
        variant === "primary" && classes.primary,
        className
      )}
    >
      {children}
    </button>
  );
};

const classes = {
  primary: "bg-black text-white disabled:bg-gray200",
};

export default Button;
