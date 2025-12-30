import Map, { MapMaker, MapPath } from '@/components/plan/Map';
import type { ItineraryItem, Place } from '@/types';

type PlaceRow = Pick<ItineraryItem, 'place' | 'duration'>;

interface Props {
  places: PlaceRow[];
  accommodation: Place | null;
}

const ItineraryMapContainer = ({ places, accommodation }: Props) => {
  const placeMarkers = places.map(({ place }) => place.coordinates);

  const markers = [
    ...placeMarkers.map((marker, index) => ({
      pos: marker,
      label: `${index + 1}`,
      color: '#0095A9' as const,
    })),
    ...(accommodation
      ? [
          {
            pos: accommodation.coordinates,
            label: `숙소`,
            color: '#C730DF' as const,
          },
        ]
      : []),
  ];
  const path = accommodation ? [...placeMarkers, accommodation.coordinates] : placeMarkers;
  const center = places[0]?.place.coordinates;

  if (!center) return null;
  return (
    <Map center={center}>
      {markers.map((marker, index) => (
        <MapMaker
          key={index}
          pos={marker.pos}
          label={marker.label}
          options={{ color: marker.color }}
        />
      ))}
      <MapPath path={path} options={{ color: '#0095A9' }} />
    </Map>
  );
};

export default ItineraryMapContainer;
