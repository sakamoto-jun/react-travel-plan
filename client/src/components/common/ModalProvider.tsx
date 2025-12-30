import { useModalStore } from '@/store';

const ModalProvider = () => {
  const modals = useModalStore((s) => s.modals);
  const closeModal = useModalStore((s) => s.closeModal);

  return (
    <>
      {modals.map((ModalComp, index) => (
        <ModalComp key={index} onClose={() => closeModal(index)} />
      ))}
    </>
  );
};

export default ModalProvider;
