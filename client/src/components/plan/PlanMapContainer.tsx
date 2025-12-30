import Map, { MapMaker, MapPath } from '@/components/plan/Map';
import { usePlanStore } from '@/store';
import type { Place } from '@/types';

interface Props {
  coordinates: { lat: number; lng: number };
}

const PlanMapContainer = ({ coordinates }: Props) => {
  const plannedPlaces = usePlanStore((s) => s.plannedPlaces);
  const plannedAccommodations = usePlanStore((s) => s.plannedAccommodations);

  const placeMarkers = plannedPlaces.map(({ place }) => place.coordinates);
  const accommodationMarkers = plannedAccommodations
    .filter((acc): acc is Place => acc !== null)
    .map((acc) => acc.coordinates);

  const markers = [
    ...placeMarkers.map((marker, index) => ({
      pos: marker,
      label: `${index + 1}`,
      color: '#0095A9' as const,
    })),
    ...accommodationMarkers.map((marker, index) => ({
      pos: marker,
      label: `H${index + 1}`,
      color: '#C730DF' as const,
    })),
  ];

  return (
    <Map center={coordinates}>
      {markers.map((marker, index) => (
        <MapMaker
          key={index}
          pos={marker.pos}
          label={marker.label}
          options={{ color: marker.color }}
        />
      ))}
      <MapPath path={placeMarkers} options={{ color: '#0095A9' }} />
    </Map>
  );
};

export default PlanMapContainer;
