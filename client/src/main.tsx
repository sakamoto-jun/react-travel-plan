import "@/utils/date";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import MapProvider from "./components/common/MapProvider.tsx";
import ModalProvider from "./components/common/ModalProvider.tsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MapProvider>
        <App />
        <ModalProvider />
      </MapProvider>
    </QueryClientProvider>
  </StrictMode>
);
