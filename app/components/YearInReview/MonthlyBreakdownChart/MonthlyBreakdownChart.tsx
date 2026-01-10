import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "../../ui/chart";

interface MonthlyBreakdownChartProps {
  incomeTotalBreakdown?: number[];
  expenseTotalBreakdown?: number[];
}

export default function MonthlyBreakdownChart({
  incomeTotalBreakdown,
  expenseTotalBreakdown,
}: MonthlyBreakdownChartProps) {
  const monthlyChartConfig = {
    totalIncome: {
      label: "Income",
      color: "#2563eb",
    },
    totalExpense: {
      label: "Expense",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  const chartData = Array.from({ length: 12 }).map((_, index) => {
    return {
      month: new Date(`${index + 1}/1`).toLocaleDateString("en-US", {
        month: "short",
      }),
      totalIncome: incomeTotalBreakdown?.at(index) ?? 0,
      totalExpense: expenseTotalBreakdown?.at(index) ?? 0,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Monthly Breakdown</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={monthlyChartConfig} className="min-h-52 w-full">
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid />
            <XAxis dataKey={"month"} tickMargin={10} axisLine={false} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey={"totalIncome"}
              fill="var(--color-totalIncome)"
              radius={4}
            />
            <Line
              dataKey={"totalExpense"}
              fill="var(--color-totalExpense)"
              radius={4}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
