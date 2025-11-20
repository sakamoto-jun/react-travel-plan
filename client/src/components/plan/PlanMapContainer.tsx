import Map, { MapMaker, MapPath } from "@/components/plan/Map";
import { usePlanStore } from "@/store";

interface Props {
  coordinates: { lat: number; lng: number };
}

const PlanMapContainer = ({ coordinates }: Props) => {
  const { plannedPlaces } = usePlanStore();
  const markers = plannedPlaces?.map(({ place }) => place.coordinates);

  return (
    <Map center={coordinates}>
      {markers.map((marker, index) => (
        <MapMaker
          key={index}
          pos={marker}
          label={`${index + 1}`}
          options={{ color: "#0095A9" }}
        />
      ))}
      <MapPath path={markers} options={{ color: "#0095A9" }} />
    </Map>
  );
};

export default PlanMapContainer;
