import { ICONS } from "@/app/icons/icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Modal = ({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) => (
  <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
    <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-xl font-bold text-card-foreground">{title}</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full"
        >
          {ICONS.CLOSE}
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export const HotspotFormModal = ({
  onClose,
  onSave,
  hotspot,
  isNew,
  scenes,
}: {
  onClose: () => void;
  onSave: (hotspot: any, isNew: boolean) => void;
  hotspot: any;
  isNew: boolean;
  scenes: any;
}) => {
  const [text, setText] = useState(hotspot.text);
  const [sceneId, setSceneId] = useState(hotspot.sceneId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...hotspot, text, sceneId }, isNew);
  };

  return (
    <Modal title={isNew ? "Add Hotspot" : "Edit Hotspot"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Hotspot Text
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="w-full bg-input text-foreground rounded-md border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Link to Scene
          </label>
          <select
            value={sceneId}
            onChange={(e) => setSceneId(e.target.value)}
            required
            className="w-full bg-input text-foreground rounded-md border p-2"
          >
            <option value="">Select a destination</option>
            {Object.entries(scenes).map(([id, scene]: [string, any]) => (
              <option key={id} value={id}>
                {scene.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Hotspot</Button>
        </div>
      </form>
    </Modal>
  );
};
