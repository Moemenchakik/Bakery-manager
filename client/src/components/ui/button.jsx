import { cn } from "../../lib/utils";

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  const variants = {
    default: "bg-black text-white hover:bg-black/90",
    outline: "border border-gray-200 bg-white hover:bg-gray-50",
    ghost: "hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}