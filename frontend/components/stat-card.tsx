import type { LucideIcon } from "lucide-react";

export function StatCard({
  title,
  value,
  suffix,
  note,
  icon: Icon,
}: {
  title: string;
  value: string;
  suffix: string;
  note: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{title}</p>
          <div className="mt-3 flex items-end gap-1">
            <span className="text-3xl font-semibold tracking-tight">{value}</span>
            {suffix ? (
              <span className="pb-1 text-sm font-medium text-zinc-500">
                {suffix}
              </span>
            ) : null}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">
        {note}
      </p>
    </div>
  );
}
