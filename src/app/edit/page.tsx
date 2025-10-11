"use client";
import { useEffect, useState } from "react";
import TourEditor from "./components/editor";
import { getTourConfig } from "@/lib/TourConfig/getConfig";

export default function EditPage() {
  const [tourConfig, setTourConfig] = useState<any | null>(null);
  const [updatedConfig, setUpdatedConfig] = useState<any | null>(null);
  // Example usage:
  // Load server tour config on mount and replace default state when available
  useEffect(() => {
    let mounted = true;
    getTourConfig().then((cfg) => {
      if (mounted && cfg) {
        try {
          // If the API returns an object, use it as the tourConfig and updatedConfig
          setTourConfig(cfg);
          setUpdatedConfig(cfg);
        } catch (e) {
          console.error("Failed to set tour config:", e);
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!tourConfig) {
    return <div>Loading...</div>;
  }
  return (
    <TourEditor
      tourConfig={tourConfig}
      updatedConfig={updatedConfig}
      setTourConfig={setTourConfig}
      setUpdatedConfig={setUpdatedConfig}
    />
  );
}
