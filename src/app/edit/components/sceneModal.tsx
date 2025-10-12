import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Modal } from "./modal";

export const SceneFormModal = ({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (scene: { title: string; panorama: string }) => void;
}) => {
  const [title, setTitle] = useState("");
  const [panorama, setPanorama] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, panorama });
  };

  return (
    <Modal title="Add New Scene" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Scene Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-input text-foreground rounded-md border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Panorama Image URL
          </label>
          <input
            type="text"
            value={panorama}
            onChange={(e) => setPanorama(e.target.value)}
            required
            className="w-full bg-input text-foreground rounded-md border p-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Use a high-resolution equirectangular image URL.
          </p>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Scene</Button>
        </div>
      </form>
    </Modal>
  );
};
