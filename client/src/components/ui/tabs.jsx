import { cn } from "../../lib/utils";

export function Tabs({ value, onValueChange, tabs }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onValueChange(t.value)}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-medium transition",
              active ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}