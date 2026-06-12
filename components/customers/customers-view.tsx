"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getCustomers } from "@/lib/api";
import type { Customer } from "@/lib/types";
import { daysAgo, initials, money, nameHue, num } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";

export function CustomersView() {
  const [items, setItems] = useState<Customer[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async (c: string | null) => {
    setLoading(true);
    try {
      const page = await getCustomers(c, 12);
      setItems((prev) => (c === null ? page.items : [...prev, ...page.items]));
      setCursor(page.nextCursor);
      setDone(page.nextCursor === null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(null);
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)
    );
  }, [items, query]);

  const avgLtv = items.length ? Math.round(items.reduce((s, c) => s + c.lifetimeValue, 0) / items.length) : 0;
  const lapsed = items.filter((c) => c.lastOrderDaysAgo >= 60).length;

  return (
    <div className="flex flex-col">
      <PageHeader
        crumb={["Crema CRM", "Customers"]}
        title="Customers"
        subtitle="The seed audience behind every segment the agent targets."
      />

      <div className="flex flex-col gap-4 p-5 sm:p-8">
        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-3">
          <Mini label="Loaded records" value={num(items.length)} />
          <Mini label="Avg. lifetime value" value={money(avgLtv)} accent />
          <Mini label="Lapsed (60d+)" value={num(lapsed)} />
        </div>

        {/* Search */}
        <div className="surface flex items-center gap-2.5 rounded-xl px-3.5 py-2.5">
          <Search size={16} className="text-crema-300/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search loaded customers by name, email or city…"
            className="w-full bg-transparent text-[13.5px] text-crema-100 outline-none placeholder:text-crema-300/35"
          />
          {query && (
            <span className="shrink-0 text-[11.5px] text-crema-300/40">{filtered.length} match</span>
          )}
        </div>

        {/* Table */}
        <div className="surface overflow-hidden rounded-card">
          <div className="hidden grid-cols-[1.6fr_1fr_0.7fr_0.9fr_0.9fr] gap-4 border-b border-crema-200/8 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-crema-300/40 sm:grid">
            <span>Customer</span>
            <span>City</span>
            <span className="text-right">Orders</span>
            <span className="text-right">LTV</span>
            <span className="text-right">Last order</span>
          </div>

          <div className="divide-y divide-crema-200/[0.05]">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-2 gap-3 px-5 py-3 transition hover:bg-crema-200/[0.03] sm:grid-cols-[1.6fr_1fr_0.7fr_0.9fr_0.9fr] sm:items-center sm:gap-4"
              >
                <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-espresso-975"
                    style={{ background: `hsl(${nameHue(c.name)} 68% 62%)` }}
                  >
                    {initials(c.name)}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-medium text-crema-100">{c.name}</div>
                    <div className="truncate text-[11.5px] text-crema-300/40">{c.email}</div>
                  </div>
                </div>
                <span className="text-[13px] text-crema-200/70">
                  <span className="text-crema-300/40 sm:hidden">City: </span>
                  {c.city}
                </span>
                <span className="text-[13px] text-crema-200/70 sm:text-right">
                  <span className="text-crema-300/40 sm:hidden">Orders: </span>
                  {c.orderCount}
                </span>
                <span className="text-[13px] font-medium text-caramel-300 sm:text-right">
                  {money(c.lifetimeValue)}
                </span>
                <span className="sm:text-right">
                  <span
                    className={`text-[12.5px] ${
                      c.lastOrderDaysAgo >= 60
                        ? "rounded-md bg-clay-500/12 px-1.5 py-0.5 text-clay-400"
                        : "text-crema-200/60"
                    }`}
                  >
                    {daysAgo(c.lastOrderDaysAgo)}
                  </span>
                </span>
              </div>
            ))}

            {loading && items.length === 0 &&
              Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-[54px]" />)}
          </div>
        </div>

        <div className="flex justify-center">
          {!done ? (
            <button
              onClick={() => load(cursor)}
              disabled={loading}
              className="rounded-lg border border-crema-200/15 px-6 py-2.5 text-[13px] font-medium text-crema-200/80 transition hover:bg-crema-200/5 disabled:opacity-50"
            >
              {loading ? "Loading…" : "Load more"}
            </button>
          ) : (
            <span className="text-[11.5px] text-crema-300/35">That&apos;s everyone in the seed set.</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="surface rounded-card px-4 py-3">
      <span className="text-[11px] font-medium uppercase tracking-wider text-crema-300/45">{label}</span>
      <div
        className="mt-0.5 font-display text-xl font-semibold tracking-tight"
        style={{ color: accent ? "var(--color-caramel-300)" : "var(--color-crema-50)" }}
      >
        {value}
      </div>
    </div>
  );
}
