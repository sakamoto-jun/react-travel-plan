import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children }: PropsWithChildren) => {
  return createPortal(
    <div className="fixed inset-0">{children}</div>,
    document.body
  );
};

const ModalBackdrop = () => {
  return <div className="fixed inset-0 bg-[rgba(1,1,1,0.5)] -z-10" />;
};

const ModalPanel = ({ children }: PropsWithChildren) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {children}
    </div>
  );
};

export { ModalBackdrop, ModalPanel };
export default Modal;
