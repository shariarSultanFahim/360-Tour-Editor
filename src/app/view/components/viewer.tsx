"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

  let viewer: any;
  useEffect(() => {
    // let viewer: any;
    if (viewerContainerRef.current && pannellum) {
      viewer = pannellum.viewer(viewerContainerRef.current, {
        ...config,
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
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 space-x-2">
        <Button onClick={() => viewer?.setPitch(viewer?.getPitch() + 10)}>
          UP
        </Button>
        <Button onClick={() => viewer?.setPitch(viewer?.getPitch() - 10)}>
          Down
        </Button>
        <Button onClick={() => viewer?.setYaw(viewer?.getYaw() + 10)}>
          Right
        </Button>
        <Button onClick={() => viewer?.setYaw(viewer?.getYaw() - 10)}>
          Left
        </Button>
        <Button onClick={() => viewer?.setHfov(viewer?.getHfov() - 10)}>
          Zoom In
        </Button>
        <Button onClick={() => viewer?.setHfov(viewer?.getHfov() + 10)}>
          Zoom Out
        </Button>
        <Button onClick={() => viewer?.toggleFullscreen()}>Fullscreen</Button>
      </div>
    </main>
  );
}
