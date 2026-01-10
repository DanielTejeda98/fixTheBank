"use client";

import { currencyFormat } from "@/app/lib/renderHelper";
import { ColumnDef } from "@tanstack/react-table";

export type CategoryBreakdown = {
  fill: string;
  id: unknown;
  name: String;
  totalExpenses: number;
};

export const categoryBreakdownColumn: ColumnDef<CategoryBreakdown>[] = [
  {
    accessorKey: "name",
    header: "Category",
    cell: (cell) => (
      <div className="flex gap-2 items-center">
        <div
          className="h-2 w-2 shrink-0 rounded-[2px]"
          style={{
            backgroundColor: cell.row.original.fill,
          }}
        />
        {cell.row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "totalExpenses",
    header: "Year Total",
    cell: (cell) => currencyFormat(cell.row.original.totalExpenses),
  },
];
