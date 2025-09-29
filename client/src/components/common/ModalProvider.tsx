import { useModalStore } from "@/store";

const ModalProvider = () => {
  const { modals, closeModal } = useModalStore();

  return (
    <>
      {modals.map((ModalComp, index) => (
        <ModalComp key={index} onClose={() => closeModal(index)} />
      ))}
    </>
  );
};

export default ModalProvider;
