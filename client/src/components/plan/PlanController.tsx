import { usePlanStore } from '@/store';
import type { City } from '@/types';
import { useNavigate } from 'react-router-dom';
import Wizard from '../common/Wizard';
import ControllerHeader from '../shared/ControllerHeader';
import AccommodationContainer from './AccommodationContainer';
import AccommodationController from './AccommodationController';
import PlaceContainer from './PlaceContainer';
import PlaceController from './PlaceController';
import StepDateConfirm from './StepDateConfirm';

interface Props {
  city: City;
}

const PlanController = ({ city }: Props) => {
  const startDate = usePlanStore((s) => s.startDate);
  const endDate = usePlanStore((s) => s.endDate);
  const navigate = useNavigate();

  const steps = [
    {
      title: '날짜 확인',
      component: ({ onNext }: { onNext: () => void }) => (
        <div className="flex flex-col px-24 py-30">
          <ControllerHeader startDate={startDate} endDate={endDate} cityName={city.name} />
          <StepDateConfirm onCompleted={onNext} />
        </div>
      ),
    },
    {
      title: '장소 선택',
      component: () => (
        <>
          <div className="flex flex-col px-24 py-30">
            <ControllerHeader startDate={startDate} endDate={endDate} cityName={city.name} />
            <div className="flex-1 overflow-y-hidden">
              <div className="flex flex-col h-full">
                <div className="mb-18 p-14 border-b-3 border-b-main text-center">
                  <h4 className="text-18 font-semibold text-main">장소 선택</h4>
                </div>
                <PlaceContainer />
              </div>
            </div>
          </div>
          <div className="px-24 py-30 bg-white">
            <PlaceController />
          </div>
        </>
      ),
    },
    {
      title: '숙소 선택',
      component: () => (
        <>
          <div className="flex flex-col px-24 py-30">
            <ControllerHeader startDate={startDate} endDate={endDate} cityName={city.name} />
            <div className="flex-1 overflow-y-hidden">
              <div className="flex flex-col h-full">
                <div className="mb-18 p-14 border-b-3 border-b-main text-center">
                  <h4 className="text-18 font-semibold text-main">숙소 선택</h4>
                </div>
                <AccommodationContainer />
              </div>
            </div>
          </div>
          <div className="px-24 py-30 bg-white">
            <AccommodationController />
          </div>
        </>
      ),
    },
  ];

  return <Wizard steps={steps} onCompleted={() => navigate(`/itinerary/${city.code}`)} />;
};

export default PlanController;
