import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ children }: PropsWithChildren) => {
  return createPortal(
    <div role="dialog" className="fixed inset-0">
      {children}
    </div>,
    document.body
  );
};

const ModalBackdrop = () => {
  return <div className="fixed inset-0 bg-[rgba(1,1,1,0.5)] -z-10" />;
};

const ModalPanel = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className={clsx('relative p-28 rounded-20 border border-gray100 bg-white', className)}>
        {children}
      </div>
    </div>
  );
};

export { ModalBackdrop, ModalPanel };
export default Modal;
