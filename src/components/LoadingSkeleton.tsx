export function LoadingSkeleton() {
  return (
    <div
      className="flex flex-col gap-2 py-1"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="skeleton h-[132px] rounded-2xl"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>

      <div className="skeleton h-[300px] rounded-2xl" />

      <div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="skeleton h-64 rounded-2xl lg:col-span-2" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    </div>
  )
}
