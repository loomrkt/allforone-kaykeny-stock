import { Skeleton } from "@/components/ui/skeleton";

export function LoadingList({
  columnsCount = 4,
  rowsCount = 5,
}: {
  columnsCount?: number;
  rowsCount?: number;
}) {
  return (
    <div className="rounded-md w-full bg-white h-[calc(100vh-14rem)] flex flex-col animate-pulse">
      {/* En-tête */}
      <div className="bg-[#F2F2F2] h-16 flex items-center px-4 space-x-4">
        {Array.from({ length: columnsCount }).map((_, idx) => (
          <Skeleton key={idx} className="h-6 w-32 rounded bg-muted" />
        ))}
      </div>

      {/* Lignes du tableau */}
      <div className="flex-1 px-4 py-2 space-y-4 overflow-auto">
        {Array.from({ length: rowsCount }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid grid-cols-4 gap-4 h-20 items-center border-b border-[#EFEFEF]"
          >
            {Array.from({ length: columnsCount }).map((_, colIdx) => (
              <Skeleton key={colIdx} className="h-8 w-full rounded bg-muted" />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination simulée */}
      <div className="flex items-center justify-end bg-white border-t border-neutral-300 p-4 h-16 space-x-2">
        <Skeleton className="h-8 w-24 rounded bg-muted" />
        <Skeleton className="h-8 w-8 rounded-full bg-muted" />
        <Skeleton className="h-8 w-8 rounded-full bg-muted" />
        <Skeleton className="h-8 w-8 rounded-full bg-muted" />
        <Skeleton className="h-8 w-24 rounded bg-muted" />
      </div>
    </div>
  );
}
