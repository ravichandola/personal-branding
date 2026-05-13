export default function BlogsLoading() {
  return (
    <div className="relative mx-auto max-w-3xl space-y-10 px-0 py-2">
      <div className="space-y-4">
        <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-10 max-w-md animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-16 max-w-2xl animate-pulse rounded-lg bg-zinc-200/70 dark:bg-zinc-800/80" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>
      <div className="h-14 animate-pulse rounded-2xl bg-zinc-200/80 dark:bg-zinc-800/80" />
      <ul className="flex flex-col gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            key={i}
            className="h-48 animate-pulse rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60"
          />
        ))}
      </ul>
    </div>
  );
}
