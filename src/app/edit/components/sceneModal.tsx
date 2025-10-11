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
