import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Sparkline } from "@/components/charts/chart-kit";
import { HEX } from "@/lib/colors";

export interface KpiCardModel {
  label: string;
  value: string;
  delta: number;
  spark: number[];
}

export function KpiCard({ kpi }: { kpi: KpiCardModel }) {
  const up = kpi.delta >= 0;
  const color = up ? HEX.leaf : HEX.berry;
  return (
    <div className="surface hover-lift rounded-card p-4">
      <div className="flex items-start justify-between">
        <span className="text-[12px] font-medium text-crema-300/55">{kpi.label}</span>
        <span
          className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold"
          style={{ color, background: `color-mix(in srgb, ${color} 14%, transparent)` }}
        >
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(kpi.delta)}%
        </span>
      </div>
      <div className="mt-1.5 font-display text-[27px] font-semibold leading-none tracking-tight text-crema-50">
        {kpi.value}
      </div>
      <div className="mt-3 -mx-1">
        <Sparkline data={kpi.spark} color={up ? HEX.caramel400 : HEX.berry} />
      </div>
      <p className="mt-1 text-[11px] text-crema-300/35">vs. previous 30 days</p>
    </div>
  );
}
