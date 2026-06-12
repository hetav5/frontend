"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HEX } from "@/lib/colors";

interface TooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
}

function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  formatter?: (v: number | string, name?: string) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="surface-2 rounded-lg px-3 py-2 text-xs shadow-xl">
      {label && <div className="mb-1 font-medium text-crema-100">{label}</div>}
      <div className="flex flex-col gap-0.5">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-crema-300/70">{p.name}</span>
            <span className="ml-auto font-semibold text-crema-50">
              {formatter ? formatter(p.value ?? "", p.name) : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Area trend (revenue) ----
export function AreaTrend({
  data,
  dataKey,
  xKey,
  color = HEX.caramel400,
  formatter,
  height = 240,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  dataKey: string;
  xKey: string;
  color?: string;
  formatter?: (v: number | string) => string;
  height?: number;
}) {
  const gid = `area-${dataKey}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey={xKey} axisLine={false} tickLine={false} tickMargin={10} />
        <YAxis axisLine={false} tickLine={false} width={48} tickFormatter={(v) => (formatter ? formatter(v) : v)} />
        <Tooltip content={<ChartTooltip formatter={(v) => (formatter ? formatter(v as number) : String(v))} />} cursor={{ stroke: HEX.grid }} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gid})`}
          dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ---- Multi-line (engagement) ----
export function MultiLine({
  data,
  xKey,
  series,
  height = 240,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  xKey: string;
  series: { key: string; label: string; color: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
        <XAxis dataKey={xKey} axisLine={false} tickLine={false} tickMargin={10} />
        <YAxis axisLine={false} tickLine={false} width={40} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: HEX.grid }} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            name={s.label}
            dataKey={s.key}
            stroke={s.color}
            strokeWidth={2.25}
            dot={false}
            activeDot={{ r: 3.5, fill: s.color, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ---- Horizontal bars (channel performance) ----
export function BarGroups({
  data,
  xKey,
  dataKey,
  height = 240,
  formatter,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  xKey: string;
  dataKey: string;
  height?: number;
  formatter?: (v: number | string) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
        <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={(v) => (formatter ? formatter(v) : v)} />
        <YAxis type="category" dataKey={xKey} axisLine={false} tickLine={false} width={72} />
        <Tooltip content={<ChartTooltip formatter={(v) => (formatter ? formatter(v as number) : String(v))} />} cursor={{ fill: "rgba(230,212,186,0.04)" }} />
        <Bar dataKey={dataKey} radius={[0, 6, 6, 0]} barSize={20}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color ?? HEX.caramel400} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ---- Donut (audience split) ----
export function Donut({
  data,
  height = 220,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip content={<ChartTooltip />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="58%"
          outerRadius="86%"
          paddingAngle={2}
          stroke="none"
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

// ---- Sparkline (KPI cards) ----
export function Sparkline({
  data,
  color = HEX.caramel400,
  height = 40,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const points = data.map((v, i) => ({ i, v }));
  const gid = `spark-${color.replace(/[^a-z0-9]/gi, "")}-${data.length}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={points} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${gid})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
