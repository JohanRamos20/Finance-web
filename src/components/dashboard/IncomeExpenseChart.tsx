"use client";

import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatters";
import type { MonthlyChartPoint } from "@/lib/calculations";

interface IncomeExpenseChartProps {
  data: MonthlyChartPoint[];
}

const LEGEND_LABELS: Record<string, string> = {
  income: "Receitas",
  expense: "Despesas",
};

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <Card>
      <h2 className="mb-4 text-[17px] font-medium">
        Receitas x despesas — últimos 6 meses
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-text)", fontSize: 11, opacity: 0.6 }}
          />
          <YAxis hide />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              background: "var(--color-bg)",
              border: "1px solid var(--color-divider)",
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, opacity: 0.8 }}
            formatter={(value: string) => LEGEND_LABELS[value] ?? value}
          />
          <Bar
            dataKey="income"
            name="income"
            fill="var(--color-accent)"
            radius={[3, 3, 0, 0]}
          />
          <Bar
            dataKey="expense"
            name="expense"
            fill="var(--color-text)"
            fillOpacity={0.3}
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
