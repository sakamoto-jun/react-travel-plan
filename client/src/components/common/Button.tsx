import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

const classes = {
  primary:
    "w-full py-14 rounded-6 bg-black text-16 text-white disabled:bg-gray200",
  action: "px-8 py-6 rounded-10 bg-main/10 text-14 text-main",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "action";
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
        "flex items-center justify-center font-medium",
        variant && classes[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
