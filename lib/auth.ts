// Client-side auth: stores the JWT + user from the CRM API and exposes
// login/register/logout helpers. Storage keys are owned by lib/api.ts.
import { API_BASE, IS_MOCK, TOKEN_KEY, USER_KEY } from "./api";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/** In MOCK mode there's no backend to auth against, so the app is open. */
export function isAuthed(): boolean {
  if (IS_MOCK) return true;
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(TOKEN_KEY);
}

function persist(res: AuthResponse): AuthUser {
  localStorage.setItem(TOKEN_KEY, res.token);
  localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  return res.user;
}

async function post(path: string, body: unknown): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message || `Request failed (${res.status})`
    );
  }
  return data as AuthResponse;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  return persist(await post("/auth/login", { email, password }));
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthUser> {
  return persist(await post("/auth/register", { name, email, password }));
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = "/login";
}
