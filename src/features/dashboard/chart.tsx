"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartDashboardProps = {
  title: string;
  data: { date: string; inbound: number; outbound: number }[];
  xAxisDataKey: string;
  dataKey: { dataKey: string; name: string; fill: string }[];
  className?: string;
};

function ChartDashboard({
  title,
  data,
  dataKey,
  xAxisDataKey,
  className,
}: ChartDashboardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey={xAxisDataKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKey.map(({ dataKey, name, fill }) => (
              <Bar key={dataKey} {...{ dataKey, name, fill }} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default ChartDashboard;
