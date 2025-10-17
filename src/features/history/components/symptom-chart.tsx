"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { HistoryEntry } from "../types";

interface SymptomChartProps {
  data: HistoryEntry[];
  symptom: keyof HistoryEntry["symptoms"];
  title: string;
  color: string;
  yAxisDomain?: [number, number];
}

export default function SymptomChart({
  data,
  symptom,
  title,
  color,
  yAxisDomain = [0, 10],
}: SymptomChartProps) {
  const chartData = data.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    value: entry.symptoms[symptom],
    fullDate: entry.date,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis domain={yAxisDomain} tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(value, payload) => {
                  if (payload && payload[0]) {
                    return new Date(
                      payload[0].payload.fullDate
                    ).toLocaleDateString();
                  }
                  return value;
                }}
                formatter={(value: number) => [value.toFixed(1), title]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
