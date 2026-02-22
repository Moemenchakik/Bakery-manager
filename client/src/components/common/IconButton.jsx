import { cn } from "../../lib/utils";

export default function IconButton({ className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}