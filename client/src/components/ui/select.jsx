import { cn } from "../../lib/utils";

export function Select({ className, ...props }) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-black/20",
        className
      )}
      {...props}
    />
  );
}