export function ScoreRing({
  score,
  label,
  size = "lg",
}: {
  score: number;
  label: string;
  size?: "md" | "lg";
}) {
  const dimension = size === "lg" ? "h-36 w-36" : "h-24 w-24";

  return (
    <div
      className={`grid ${dimension} place-items-center rounded-full`}
      style={{
        background: `conic-gradient(#111827 ${score * 3.6}deg, rgba(161,161,170,.25) 0deg)`,
      }}
    >
      <div className="grid h-[78%] w-[78%] place-items-center rounded-full bg-white text-center shadow-inner dark:bg-zinc-950">
        <div>
          <div className="text-3xl font-semibold tracking-tight">{score}</div>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
