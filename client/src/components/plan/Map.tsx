import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import Loading from "../common/Loading";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface Props {
  center: {
    lat: number;
    lng: number;
  };
  markers?: {
    name: string;
    pos: {
      lat: number;
      lng: number;
    };
  }[];
}

const Map = ({ center, markers = [] }: Props) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
  });

  if (!isLoaded) return <Loading />;

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
          fill="#C730DF"
        />
      </svg>
    `),
    scaledSize: new window.google.maps.Size(30, 30),
  };
  return (
    <GoogleMap mapContainerClassName="w-full h-full" center={center} zoom={13}>
      {markers.map((p, index) => (
        <MarkerF
          key={index}
          position={p.pos}
          title={p.name}
          icon={markerIcon}
          label={{ text: `${index + 1}`, color: "white" }}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;
