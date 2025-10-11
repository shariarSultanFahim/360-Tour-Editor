"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { saveTourConfig } from "@/lib/TourConfig/postConfig";
import { SceneFormModal } from "./sceneModal";
import { HotspotFormModal } from "./hotspotModal";
import { ICONS } from "@/app/icons/icons";

export default function TourEditor({
  tourConfig,
  setTourConfig,
  updatedConfig,
  setUpdatedConfig,
}: {
  tourConfig: any;
  setTourConfig: (config: any) => void;
  updatedConfig: any;
  setUpdatedConfig: (config: any) => void;
}) {
  const viewerRef = useRef<any>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [isAddingHotspot, setIsAddingHotspot] = useState(false);
  const [modal, setModal] = useState<{
    type: "addScene" | "editHotspot";
    sceneId?: string;
    hotspot?: any;
    isNew?: boolean;
  } | null>(null);
  const [pannellum, setPannellum] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setUpdatedConfig(tourConfig);
  }, [tourConfig, setUpdatedConfig]);

  const handleSaveAll = async () => {
    if (!updatedConfig) {
      setSaveMessage("Nothing to save");
      return;
    }
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await saveTourConfig(updatedConfig);
      setSaveMessage("Saved successfully!");
    } catch (e) {
      console.error(e);
      setSaveMessage("Save failed.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

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
    if (!selectedScene && tourConfig.scenes) {
      const firstSceneId = Object.keys(tourConfig.scenes)[0];
      if (firstSceneId) setSelectedScene(firstSceneId);
    }
  }, [tourConfig.scenes, selectedScene]);

  useEffect(() => {
    let viewerInstance: any;
    if (selectedScene && panoramaRef.current && pannellum && tourConfig) {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }

      const sceneConfig =
        tourConfig.scenes[selectedScene as keyof typeof tourConfig.scenes];
      viewerInstance = pannellum.viewer(panoramaRef.current, {
        type: "equirectangular",
        panorama: sceneConfig.panorama,
        autoLoad: true,
        pitch: sceneConfig.pitch || 0,
        yaw: sceneConfig.yaw || 0,
        hfov: sceneConfig.hfov || 100,
        hotSpots: sceneConfig.hotSpots,
        hotSpotDebug: isAddingHotspot,
      });
      viewerRef.current = viewerInstance;
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, [selectedScene, tourConfig, isAddingHotspot, pannellum]);

  const handlePlaceHotspot = () => {
    if (!viewerRef.current || !selectedScene) return;

    const pitch = viewerRef.current.getPitch();
    const yaw = viewerRef.current.getYaw();

    const newHotspot = {
      pitch,
      yaw,
      type: "scene",
      text: "New Link",
      sceneId: "",
    };

    setModal({
      type: "editHotspot",
      sceneId: selectedScene,
      hotspot: newHotspot,
      isNew: true,
    });
    setIsAddingHotspot(false);
  };

  const handleAddScene = (newScene: { title: string; panorama: string }) => {
    const newSceneId = `scene_${Date.now()}`;
    const updated = {
      ...tourConfig,
      scenes: {
        ...tourConfig.scenes,
        [newSceneId]: {
          ...newScene,
          type: "equirectangular",
          hotSpots: [],
        },
      },
    };
    if (!updated.default.firstScene) {
      updated.default.firstScene = newSceneId;
    }
    setTourConfig(updated);
    setSelectedScene(newSceneId);
    setModal(null);
  };

  const handleSaveHotspot = (hotspot: any, isNew: boolean) => {
    if (!modal?.sceneId) return;
    const updated = JSON.parse(JSON.stringify(tourConfig));
    const scene =
      updated.scenes[modal.sceneId as keyof typeof tourConfig.scenes];
    if (isNew) {
      if (!scene.hotSpots) scene.hotSpots = [];
      scene.hotSpots.push(hotspot);
    } else {
      const index = scene.hotSpots.findIndex(
        (h: any) =>
          h.pitch === modal.hotspot.pitch && h.yaw === modal.hotspot.yaw
      );
      if (index > -1) {
        scene.hotSpots[index] = hotspot;
      }
    }
    setTourConfig(updated);
    setModal(null);
  };

  const handleDeleteHotspot = (hotspotToDelete: any) => {
    if (window.confirm("Are you sure you want to delete this hotspot?")) {
      const updated = JSON.parse(JSON.stringify(tourConfig));
      if (!selectedScene) return;
      const scene =
        updated.scenes[selectedScene as keyof typeof tourConfig.scenes];
      scene.hotSpots = scene.hotSpots.filter(
        (h: any) =>
          h.pitch !== hotspotToDelete.pitch || h.yaw !== hotspotToDelete.yaw
      );
      setTourConfig(updated);
    }
  };

  const renderTopBar = () => (
    <div className="absolute top-0 left-0 right-0 bg-background/50 backdrop-blur-sm z-10 p-4 flex justify-between items-center border-b">
      <h1 className="text-2xl font-bold text-foreground tracking-wider">
        Tour Editor
      </h1>
      <div className="flex gap-4 items-center">
        <div className="flex items-center text-sm text-muted-foreground min-w-[120px]">
          {saveMessage && (
            <span className="mr-2 transition-opacity duration-300">
              {saveMessage}
            </span>
          )}
        </div>
        <Button asChild variant="outline">
          <Link href="/view" target="_blank" rel="noopener noreferrer">
            {ICONS.VIEW}{" "}
            <span className="ml-2 hidden sm:inline">Preview Tour</span>
          </Link>
        </Button>
        <Button onClick={handleSaveAll} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );

  return (
    <main className="font-sans antialiased bg-background h-screen w-screen relative overflow-hidden text-foreground">
      {renderTopBar()}
      <div className="pt-[72px] h-full flex flex-col md:flex-row w-full">
        {/* Scene List */}
        <div className="w-full md:w-1/4 lg:w-1/5 bg-card p-4 border-r flex flex-col">
          <h2 className="text-xl font-bold mb-4">Scenes</h2>
          <div className="flex-grow overflow-y-auto space-y-2 pr-2">
            {Object.entries(tourConfig.scenes).map(([id, scene]) => (
              <div
                key={id}
                onClick={() => setSelectedScene(id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedScene === id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                <p className="font-semibold truncate">{(scene as any).title}</p>
              </div>
            ))}
          </div>
          <Button
            onClick={() => setModal({ type: "addScene" })}
            className="mt-4 w-full"
          >
            {ICONS.ADD} <span className="ml-2">Add Scene</span>
          </Button>
        </div>

        {/* Panorama Preview */}
        <div className="flex-1 flex flex-col p-4 bg-muted/40">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {selectedScene
              ? (
                  tourConfig.scenes[
                    selectedScene as keyof typeof tourConfig.scenes
                  ] as any
                )?.title
              : "Select a scene"}
          </h2>
          <div
            ref={panoramaRef}
            className="w-full flex-grow bg-black rounded-lg border-2"
          >
            {!selectedScene && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Please add or select a scene to start editing.
              </div>
            )}
          </div>
        </div>

        {/* Hotspot Manager */}
        {selectedScene && (
          <div className="w-full md:w-1/4 lg:w-1/5 bg-card p-4 border-l flex flex-col">
            <h2 className="text-xl font-bold mb-4">Hotspots</h2>
            <div className="flex-grow overflow-y-auto space-y-2 pr-2">
              {(
                (
                  tourConfig.scenes[
                    selectedScene as keyof typeof tourConfig.scenes
                  ] as any
                ).hotSpots || []
              ).map((spot: any, index: number) => (
                <div
                  key={index}
                  className="bg-secondary p-3 rounded-lg flex justify-between items-center"
                >
                  <div className="truncate">
                    <p className="font-semibold">{spot.text}</p>
                    <p className="text-xs text-muted-foreground">
                      Links to:{" "}
                      {(
                        tourConfig.scenes[
                          spot.sceneId as keyof typeof tourConfig.scenes
                        ] as any
                      )?.title || "..."}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setModal({
                          type: "editHotspot",
                          sceneId: selectedScene,
                          hotspot: spot,
                          isNew: false,
                        })
                      }
                      className="h-8 w-8"
                    >
                      {ICONS.EDIT}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteHotspot(spot)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      {ICONS.TRASH}
                    </Button>
                  </div>
                </div>
              ))}
              {(!(
                tourConfig.scenes[
                  selectedScene as keyof typeof tourConfig.scenes
                ] as any
              )?.hotSpots ||
                (
                  tourConfig.scenes[
                    selectedScene as keyof typeof tourConfig.scenes
                  ] as any
                ).hotSpots.length === 0) && (
                <p className="text-muted-foreground text-center py-4">
                  No hotspots in this scene.
                </p>
              )}
            </div>
            {!isAddingHotspot ? (
              <Button
                onClick={() => setIsAddingHotspot(true)}
                className="mt-4 w-full"
              >
                {ICONS.LOCATION} <span className="ml-2">Add Hotspot</span>
              </Button>
            ) : (
              <div className="mt-4 space-y-2">
                <Button onClick={handlePlaceHotspot} className="w-full">
                  Place Hotspot Here
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsAddingHotspot(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {modal?.type === "addScene" && (
        <SceneFormModal
          onClose={() => setModal(null)}
          onSave={handleAddScene}
        />
      )}
      {modal?.type === "editHotspot" && (
        <HotspotFormModal
          onClose={() => setModal(null)}
          onSave={handleSaveHotspot}
          hotspot={modal.hotspot}
          isNew={modal.isNew ?? false}
          scenes={tourConfig.scenes}
        />
      )}
    </main>
  );
}
