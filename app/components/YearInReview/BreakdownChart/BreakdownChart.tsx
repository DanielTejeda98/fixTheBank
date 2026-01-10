import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";
import { currencyFormat } from "@/app/lib/renderHelper";
import CategoryBreakdownTable from "../CategoryBreakdownTable/CategoryBreakdownTable";
import { CategoryBreakdown } from "../CategoryBreakdownTable/columns";

const COLORS = [
  "#2563eb",
  "#5071ee",
  "#6c80f1",
  "#838ff3",
  "#989ef6",
  "#abaef9",
  "#bdbefb",
  "#cfcefd",
  "#e0dfff",
  "#ceccff",
  "#bbbaff",
  "#a8a7ff",
  "#9495ff",
  "#7e83ff",
  "#6671ff",
  "#475fff",
  "#004dff",
];

interface BreakdownChartProps {
  title: string;
  expenseBreakdown?: {
    id: unknown;
    name: string;
    totalExpenses: number;
  }[];
}

export default function BreakdownChart({
  title,
  expenseBreakdown,
}: BreakdownChartProps) {
  if (!expenseBreakdown) return null;

  const expenseBreakdownConfig = {
    totalExpenses: {
      label: "Total Expenses",
    },
    ...expenseBreakdown.reduce((acc, cteb) => {
      acc[cteb.id as string] = {
        label: cteb.name,
      };

      return acc;
    }, {} as Record<string, any>),
  } satisfies ChartConfig;

  const expenseBreakdownData: CategoryBreakdown[] =
    expenseBreakdown.map((cteb, index) => ({
      ...cteb,
      fill: COLORS[index % COLORS.length],
    })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={expenseBreakdownConfig}
          className="min-h-52 w-full"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={expenseBreakdownData}
              dataKey={"totalExpenses"}
              fill="#8884d8"
              label={(label) => {
                return currencyFormat(label.totalExpenses);
              }}
            ></Pie>
          </PieChart>
        </ChartContainer>

        <CategoryBreakdownTable data={expenseBreakdownData} />
      </CardContent>
    </Card>
  );
}
