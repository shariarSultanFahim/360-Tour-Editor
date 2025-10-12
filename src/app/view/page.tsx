"use client";

import React, { useEffect } from "react";
import TourViewer from "./components/viewer";

export default function ViewPage() {
  const [tourConfig, setTourConfig] = React.useState<any>(null);

  async function getTourConfig() {
    try {
      const response = await fetch("/api/tour"); // Sends a GET request
      if (!response.ok) {
        throw new Error("Failed to fetch tour configuration.");
      }
      const config = await response.json();
      console.log("Tour config loaded:", config);
      return config;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    let mounted = true;
    getTourConfig().then((config) => {
      if (mounted && config) {
        try {
          // If the API returns an object, use it as the tourConfig
          setTourConfig(config as any);
        } catch (e) {
          console.error("Failed to set tour config:", e);
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return <TourViewer config={tourConfig} />;
}
