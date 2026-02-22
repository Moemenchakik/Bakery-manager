import { cn } from "../../lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-black/20 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}