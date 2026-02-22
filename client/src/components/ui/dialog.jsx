import { cn } from "../../lib/utils";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // click outside closes
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className={cn("relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-lg")}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn("p-6 pb-2", className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return <div className={cn("text-lg font-semibold", className)} {...props} />;
}

export function DialogContent({ className, ...props }) {
  return <div className={cn("p-6 pt-3", className)} {...props} />;
}

export function DialogFooter({ className, ...props }) {
  return <div className={cn("p-6 pt-0 flex justify-end gap-2", className)} {...props} />;
}