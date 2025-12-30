import { usePlanStore } from '@/store';
import type { City, ItineraryItem } from '@/types';
import { useShallow } from 'zustand/shallow';
import Tabs from '../common/Tabs';
import ControllerHeader from '../shared/ControllerHeader';
import DayItineraryView from './DayItineraryView';
import ItineraryMapContainer from './ItineraryMapContainer';

interface Props {
  itinerary: ItineraryItem[][];
  city: City;
}

const ItineraryController = ({ itinerary, city }: Props) => {
  const { startDate, endDate, plannedAccommodations } = usePlanStore(
    useShallow((s) => ({
      startDate: s.startDate,
      endDate: s.endDate,
      plannedAccommodations: s.plannedAccommodations,
    }))
  );

  const tabs = itinerary.map((day, index) => {
    return {
      title: `${index + 1}일차`,
      component: () => (
        <div className="flex-1 flex">
          <div className="flex flex-col px-24 py-30">
            <ControllerHeader startDate={startDate} endDate={endDate} cityName={city.name} />
            <div className="w-[280px] flex flex-col gap-y-50">
              <DayItineraryView places={day} />
            </div>
          </div>
          <div className="flex-1 bg-gray300">
            <ItineraryMapContainer places={day} accommodation={plannedAccommodations[index]} />
          </div>
        </div>
      ),
    };
  });

  return <Tabs tabs={tabs} className="h-full" />;
};

export default ItineraryController;
