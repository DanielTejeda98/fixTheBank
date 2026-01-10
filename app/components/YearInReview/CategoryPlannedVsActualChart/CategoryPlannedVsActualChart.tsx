"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";
import { useState } from "react";
import { Button } from "../../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryPlannedVsActualChartProps {
  data?: {
    id: unknown;
    name: string;
    totalExpenses: number;
    totalPlanned: number;
  }[];
}

export default function CategoryPlannedVsActualChart({
  data,
}: CategoryPlannedVsActualChartProps) {
  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);

  if (!data) return;

  const chartConfig = {
    totalPlanned: {
      label: "Planned",
      color: "#2563eb",
    },
    totalExpenses: {
      label: "Actual",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  const sortedData = data.sort(
    (a, b) =>
      b.totalExpenses - b.totalPlanned - (a.totalExpenses - a.totalPlanned)
  );

  const pagedData = sortedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const maxPage = Math.ceil(sortedData.length / PAGE_SIZE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Category Planned VS Actual Expenses</h2>
        </CardTitle>
        <CardDescription>
          Sorted by gratest difference between Expenses and Planned.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {maxPage > 1 ? (
          <div className="flex gap-2 justify-end">
            <Button
              size={"sm"}
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft />
            </Button>
            <Button
              size={"sm"}
              disabled={page === maxPage}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        ) : null}
        <ChartContainer config={chartConfig} className="min-h-52 w-full">
          <BarChart accessibilityLayer data={pagedData}>
            <CartesianGrid />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <XAxis dataKey={"name"} tickMargin={10} />
            <Bar
              dataKey={"totalPlanned"}
              fill="var(--color-totalPlanned)"
              radius={4}
            />
            <Bar
              dataKey={"totalExpenses"}
              fill="var(--color-totalExpenses)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
