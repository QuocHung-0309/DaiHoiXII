export type UserSession = {
  delegateId?: string;   // MSSV
  displayName?: string;  // tên đại biểu (optional)
  isGuest?: boolean;     // khách thì true
};

const LS_KEY = "congress.user";

export function getSession(): UserSession {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setSession(patch: Partial<UserSession>) {
  if (typeof window === "undefined") return;
  const cur = getSession();
  localStorage.setItem(LS_KEY, JSON.stringify({ ...cur, ...patch }));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_KEY);
}
