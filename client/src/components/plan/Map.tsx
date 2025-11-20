import {
  GoogleMap,
  MarkerF,
  PolylineF,
  useJsApiLoader,
} from "@react-google-maps/api";
import type { PropsWithChildren } from "react";
import Loading from "../common/Loading";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
}
interface MapMakerProps {
  pos: { lat: number; lng: number };
  label?: string;
  options?: { color?: `#${string}` };
}
interface MapPathProps {
  path: { lat: number; lng: number }[];
  options?: { color?: `#${string}` };
}

const Map = ({ center, children }: PropsWithChildren<MapProps>) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
  });

  if (!isLoaded) return <Loading />;

  return (
    <GoogleMap mapContainerClassName="w-full h-full" center={center} zoom={13}>
      {children}
    </GoogleMap>
  );
};

const MapMaker = ({
  pos,
  label,
  options: { color = "#C730DF" } = {},
}: MapMakerProps) => {
  const markerIcon = {
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
      <svg
        width="30"
        height="30"
        viewBox="-16 -16 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="0"
          cy="0"
          r="15"
          fill="${color}"
        />
      </svg>
    `),
    scaledSize: new window.google.maps.Size(30, 30),
  };

  return (
    <MarkerF
      position={pos}
      icon={markerIcon}
      label={label ? { text: label, color: "#FFFFFF" } : undefined}
    />
  );
};

const MapPath = ({
  path,
  options: { color = "#C730DF" } = {},
}: MapPathProps) => {
  const polylineOptions = { strokeColor: color };

  return <PolylineF path={path} options={polylineOptions} />;
};

export { MapMaker, MapPath };
export default Map;
