"use client";

import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (rowData: TData) => void;
  className?: string;
  totalQuantity?: number;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>; // Corrected type
}

export function DataTable<TData, TValue>({
  columns = [],
  data = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onRowClick,
  className,
  totalQuantity,
  sorting,
  onSortingChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    manualSorting: true,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={cn(
        "rounded-md w-full bg-white h-[calc(100vh-11rem)] flex flex-col",
        className
      )}
    >
      <Table className="flex-1">
        <TableHeader className="bg-[#F2F2F2] h-16 sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    index === 0
                      ? "rounded-tl-xl rounded-bl-xl cursor-pointer select-none"
                      : index === headerGroup.headers.length - 1
                      ? "rounded-tr-xl rounded-br-xl cursor-pointer select-none"
                      : "cursor-pointer select-none"
                  )}
                  onClick={
                    header.column.getCanSort()
                      ? header.column.getToggleSortingHandler()
                      : undefined
                  }
                >
                  <div className="flex items-center gap-1 select-none">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{
                      asc: "   ↑",
                      desc: "   ↓",
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="flex-1 overflow-auto">
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-[#EFEFEF] hover:bg-[#FFD1AF] h-10 cursor-pointer"
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    onClick={(e) => {
                      if (cell.column.id === "actions") {
                        e.stopPropagation();
                      }
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between bg-white border-t border-neutral-300 p-4 h-16 text-sm">
        {typeof totalQuantity === "number" ? (
          <div className="text-gray-600">
            Total quantité de produit en stock :{" "}
            <span className="font-medium">
              <strong>{totalQuantity}</strong>
            </span>
          </div>
        ) : (
          <div />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            if (onPageChange) onPageChange(page);
          }}
        />
      </div>
    </div>
  );
}
