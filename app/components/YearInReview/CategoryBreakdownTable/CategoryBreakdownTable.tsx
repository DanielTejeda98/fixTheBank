import { DataTable } from "@/app/components/ui/data-table";
import { categoryBreakdownColumn, type CategoryBreakdown } from "./columns";

interface CategoryBreakdownTableProps {
  data: CategoryBreakdown[];
}

export default function CategoryBreakdownTable({
  data,
}: CategoryBreakdownTableProps) {
  return (
    <div>
      <DataTable columns={categoryBreakdownColumn} data={data} />
    </div>
  );
}
