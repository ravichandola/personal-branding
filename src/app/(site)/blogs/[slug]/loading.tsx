export default function BlogPostLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-2">
      <div className="space-y-3">
        <div className="h-3 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-12 max-w-2xl animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-20 max-w-xl animate-pulse rounded-lg bg-zinc-200/70 dark:bg-zinc-800/80" />
      </div>
      <div className="space-y-3 pt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 animate-pulse rounded bg-zinc-200/60 dark:bg-zinc-800/60"
            style={{ width: `${68 + ((i * 13) % 28)}%` }}
          />
        ))}
      </div>
    </div>
  );
}
