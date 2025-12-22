export function decodeJwtPayload<T = Record<string, unknown>>(
  token: string
): T | null {
  try {
    const base64Url = token.split(".")[1]; // take the payload part
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
