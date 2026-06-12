// Hex mirrors of the theme tokens, for SVG/recharts where CSS var()
// paints are unreliable. Keep in sync with globals.css @theme.
export const HEX = {
  caramel300: "#f0c489",
  caramel400: "#e6ac63",
  caramel500: "#d9954a",
  clay400: "#d98b6a",
  clay500: "#c7704c",
  leaf: "#6cae73",
  berry: "#cf6178",
  crema: "#f4ead9",
  cremaDim: "#cbb289",
  grid: "rgba(230,212,186,0.07)",
  whatsapp: "#4bb778",
  sms: "#6aa9d9",
  email: "#e6ac63",
  rcs: "#b48bd9",
  viz: ["#e6ac63", "#d98b6a", "#b48bd9", "#6aa9d9", "#6cae73", "#cf6178"],
} as const;
