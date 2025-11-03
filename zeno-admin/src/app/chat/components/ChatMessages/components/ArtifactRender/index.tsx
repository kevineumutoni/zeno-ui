"use client";

import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { Typography } from "@mui/material";
import type { TableData } from "../../../../../utils/types/chat";
import type { ArtifactRendererProps } from "../../../../../utils/types/chat";

export type ChartData = {
  x: (string | number)[];
  y: number[];
  title?: string;
  chart_type?: "bar" | "line" | "pie";
};

export default function ChatArtifactRenderer({
  artifactType,
  artifactData,
  text,
}: ArtifactRendererProps) {
  if (artifactType === "chart")
    return <ChartRenderer data={artifactData as ChartData} />;
  if (artifactType === "table")
    return <TableRenderer data={artifactData as TableData} />;
  if (artifactType === "text")
    return (
      <p className="max-w-[80%] whitespace-pre-wrap text-sm text-gray-900">
        {text}
      </p>
    );
  return null;
}

function getYAxisLabel(title?: string): string {
  if (!title) return "Value";
  const lower = title.toLowerCase();
  if (lower.includes("price")) {
    return "Price(U.S. cents per pound)";
  }
  if (lower.includes("volume") || lower.includes("export")) {
    return "Volume (million 60-kg bags)";
  }
  return "Value";
}

function ChartRenderer({ data }: { data: ChartData }) {
  if (!data?.x || !data?.y || !Array.isArray(data.x) || !Array.isArray(data.y)) {
    return (
      <div className="p-2 rounded-lg bg-white shadow">
        <p className="text-xs text-gray-500">Invalid chart data</p>
        <pre className="text-[0.7rem] overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }

  const chartData = data.x.map((xValue, index) => ({
    label: xValue,
    value: data.y[index] ?? 0,
  }));

  const chartType = data.chart_type || "line";
  const yAxisLabel = getYAxisLabel(data.title);
  const xAxisLabel = "Year";

  return (
    <div className="rounded-2xl shadow max-w-[480px] w-full">
      {data.title && (
        <Typography
          variant="subtitle1"
          align="center"
          className="text-gray-900 mb-2 font-semibold"
        >
          {data.title}
        </Typography>
      )}

      {chartType === "bar" && (
        <div className="bg-white rounded-xl p-2">
          <BarChart
            xAxis={[
              {
                data: chartData.map((d) => d.label),
                scaleType: "band",
                label: xAxisLabel,
              },
            ]}
            yAxis={[{ label: yAxisLabel }]}
            series={[
              {
                data: chartData.map((d) => d.value),
                color: "#60a5fa",
              },
            ]}
            width={400}
            height={250}
            margin={{ top: 10, bottom: 40, left: 60, right: 20 }}
          />
        </div>
      )}

      {chartType === "line" && (
        <div className="bg-[#dbe4e4] rounded-xl p-2">
          <LineChart
            xAxis={[
              {
                data: chartData.map((d) => d.label),
                label: xAxisLabel,
              },
            ]}
            yAxis={[{ label: yAxisLabel }]}
            series={[
              {
                data: chartData.map((d) => d.value),
                color: "#3b82f6",
              },
            ]}
            width={400}
            height={250}
            margin={{ top: 10, bottom: 40, left: 60, right: 20 }}
          />
        </div>
      )}

      {chartType === "pie" && (
        <div className="bg-white rounded-xl p-2">
          <PieChart
            series={[
              {
                data: chartData.map((d, index) => ({
                  id: String(d.label),
                  value: d.value,
                  label: String(d.label),
                  color: ["#60a5fa", "#f472b6", "#a78bfa"][index % 3],
                })),
              },
            ]}
            width={400}
            height={250}
          />
        </div>
      )}
    </div>
  );
}

function TableRenderer({ data }: { data: TableData }) {
  if (data?.x && data?.y) {
    return (
      <div className="rounded-2xl shadow p-4 max-w-[500px] overflow-x-auto">
        {data.title && (
          <p className="mb-2 text-blue-600 font-medium">{data.title}</p>
        )}
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="border-b font-bold p-1">Label</th>
              <th className="border-b font-bold p-1">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.x.map((label, index) => (
              <tr key={index}>
                <td className="border-b p-1">{label}</td>
                <td className="border-b p-1">{data.y?.[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data?.columns || !data?.rows) return null;

  return (
    <div className="shadow p-4 max-w-[480px] overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#020a18]">
          <tr>
            {data.columns.map((col, index) => (
              <th key={index} className="border-b font-bold p-1">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellindex) => (
                <td key={cellindex} className="border-b p-1">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}