export async function login(
  identifier: string,
  password: string
): Promise<void> {
  const credentials = btoa(`${identifier}:${password}`);

  const res = await fetch("https://learn.reboot01.com/api/auth/signin", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  const raw = await res.text();
  let token: string;

  try {
    const parsed = JSON.parse(raw);
    token = parsed.token || parsed.jwt || parsed;
  } catch {
    token = raw.trim();
  }

  if (!res.ok || !token || typeof token !== "string") {
    const errorMsg =
      typeof token === "string"
        ? token
        : (typeof token === "object" && token !== null && "error" in token
            ? (token as any).error
            : "Login failed");
    throw new Error(errorMsg);
}

  localStorage.setItem("jwt", token);
}

export function logout(): void {
  localStorage.removeItem("jwt");
}
