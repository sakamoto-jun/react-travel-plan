import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface FilterProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
}

const Filter = ({ className, children, isActive, ...props }: FilterProps) => {
  return (
    <button
      type="button"
      className={clsx(
        'p-14 text-20 border-b-3',
        isActive
          ? 'border-main text-main font-semibold'
          : 'border-transparent text-gray500 font-medium',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Filter;
