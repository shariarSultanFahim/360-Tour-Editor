"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TourViewer({ config }: { config: any }) {
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const [pannellum, setPannellum] = useState<any>(null);

  useEffect(() => {
    if (!document.getElementById("pannellum-css")) {
      const link = document.createElement("link");
      link.id = "pannellum-css";
      link.rel = "stylesheet";
      link.href =
        "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("pannellum-js")) {
      const script = document.createElement("script");
      script.id = "pannellum-js";
      script.src =
        "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
      script.async = true;
      script.onload = () => setPannellum((window as any).pannellum);
      document.body.appendChild(script);
    } else {
      setPannellum((window as any).pannellum);
    }
  }, []);

  useEffect(() => {
    let viewer: any;
    if (viewerContainerRef.current && pannellum) {
      viewer = pannellum.viewer(viewerContainerRef.current, {
        ...config,
        autoLoad: true,
        autoRotate: -2,
      });
    }
    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [config, pannellum]);

  return (
    <main className="h-screen w-screen relative bg-black">
      <div ref={viewerContainerRef} className="absolute inset-0" />
      <div className="absolute top-4 right-4 z-10">
        <Button asChild variant="secondary">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  );
}
