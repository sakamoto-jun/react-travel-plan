import CloseIcon from '@/assets/icons/close.svg?react';
import Modal, { ModalBackdrop, ModalPanel } from '@/components/common/Modal';
import { useModalStore } from '@/store';
import type { City } from '@/types';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import CityDetail from './CityDetail';

interface CityListProps {
  cities: City[];
}

const CityList = ({ cities }: CityListProps) => {
  const navigate = useNavigate();
  const openModal = useModalStore((s) => s.openModal);
  const clearModals = useModalStore((s) => s.clearModals);

  const handleCreatePlan = (cityCode: string) => {
    navigate(`/plan/${cityCode}`);
    clearModals();
  };

  const openDetailModal = (city: City) => {
    openModal(({ onClose }) => {
      return (
        <Modal>
          <ModalBackdrop />
          <ModalPanel className="w-[655px] min-h-[300px] pt-58 pb-37">
            <button type="button" className="absolute top-22 right-28" onClick={onClose}>
              <CloseIcon />
            </button>
            <CityDetail city={city} onCreatePlan={() => handleCreatePlan(city.code)} />
          </ModalPanel>
        </Modal>
      );
    });
  };

  return (
    <div className="w-full flex flex-wrap justify-between gap-y-28 ">
      {cities.length > 0 ? (
        cities.map((city) => (
          <button type="button" key={city._id} onClick={() => openDetailModal(city)}>
            <Card
              title={city.nameEn}
              description={`${city.country.name} ${city.name}`}
              image={city.thumbnail}
            />
          </button>
        ))
      ) : (
        <p className="w-full text-center text-gray500 py-40">검색 결과가 없습니다 😢</p>
      )}
    </div>
  );
};

export default CityList;
