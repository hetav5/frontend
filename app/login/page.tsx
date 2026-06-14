"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Loader2 } from "lucide-react";
import { login, register } from "@/lib/auth";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(name, email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center px-5 py-10">
      <div className="w-full max-w-[400px]">
        <div className="mb-7 flex flex-col items-center text-center">
          <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-caramel-400 to-clay-500 text-espresso-975 shadow-sm">
            <Coffee size={24} strokeWidth={2.25} />
          </span>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-crema-50">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-[13px] text-crema-300/50">
            {mode === "login"
              ? "Sign in to your Crema CRM workspace."
              : "Set up access to your Crema CRM workspace."}
          </p>
        </div>

        <form onSubmit={submit} className="surface flex flex-col gap-3 rounded-card p-6">
          {mode === "register" && (
            <Field
              label="Name"
              type="text"
              value={name}
              onChange={setName}
              placeholder="Your name"
              autoComplete="name"
            />
          )}
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@company.com"
            autoComplete="email"
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder={mode === "register" ? "At least 8 characters" : "••••••••"}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />

          {error && (
            <p className="rounded-lg border border-clay-500/25 bg-clay-500/8 px-3 py-2 text-[12.5px] text-clay-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-caramel ring-focus mt-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13.5px] font-semibold disabled:opacity-60"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-[13px] text-crema-300/50">
          {mode === "login" ? "No account yet?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
            }}
            className="font-medium text-caramel-300 transition hover:text-caramel-200"
          >
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11.5px] font-medium uppercase tracking-wider text-crema-300/45">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="rounded-lg border border-crema-200/12 bg-espresso-975/40 px-3.5 py-2.5 text-[13.5px] text-crema-100 outline-none transition focus:border-caramel-400/40 placeholder:text-crema-300/30"
      />
    </label>
  );
}
