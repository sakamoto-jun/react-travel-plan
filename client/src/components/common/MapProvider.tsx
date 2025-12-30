import { useJsApiLoader } from "@react-google-maps/api";
import type { PropsWithChildren } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const MapProvider = ({ children }: PropsWithChildren) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
  });

  if (!isLoaded) return null;

  return <>{children}</>;
};

export default MapProvider;
