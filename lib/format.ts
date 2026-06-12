export const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export const compact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact" }).format(n);

export const num = (n: number) => new Intl.NumberFormat("en-US").format(n);

export function daysAgo(d: number): string {
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 30) return `${d}d ago`;
  const m = Math.round(d / 30);
  return `${m}mo ago`;
}

export function dateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// stable warm hue per name for avatar tints
export function nameHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 60;
  return 18 + h; // 18–78deg → amber/caramel band
}
