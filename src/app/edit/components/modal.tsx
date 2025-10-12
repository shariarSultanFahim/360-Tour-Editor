import { ICONS } from "@/app/icons/icons";

export const Modal = ({
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
