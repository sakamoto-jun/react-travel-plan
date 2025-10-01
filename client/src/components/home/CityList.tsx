import CloseIcon from "@/assets/icons/close.svg?react";
import Modal, { ModalBackdrop, ModalPanel } from "@/components/common/Modal";
import { useModalStore } from "@/store";
import type { City } from "@/types";
import Card from "./Card";
import CityDetail from "./CityDetail";

interface CityListProps {
  cities: City[];
}

const CityList = ({ cities }: CityListProps) => {
  const { openModal } = useModalStore();

  const openDetailModal = (city: City) => {
    openModal(({ onClose }) => {
      return (
        <Modal>
          <ModalBackdrop />
          <ModalPanel>
            <div className="relative w-[655px] min-h-[300px] pt-58 px-28 pb-37 rounded-20 border border-gray100 bg-white">
              <button
                type="button"
                className="absolute top-22 right-28"
                onClick={onClose}
              >
                <CloseIcon />
              </button>
              <CityDetail city={city} />
            </div>
          </ModalPanel>
        </Modal>
      );
    });
  };

  return (
    <div className="w-full flex flex-wrap justify-between gap-y-28 ">
      {cities.map((city) => (
        <button
          type="button"
          key={city._id}
          onClick={() => openDetailModal(city)}
        >
          <Card
            title={city.nameEn}
            description={`${city.country.name} ${city.name}`}
            image={city.thumbnail}
          />
        </button>
      ))}
    </div>
  );
};

export default CityList;
