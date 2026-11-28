/** Resolve backend upload paths against the configured API host. */
export function getImageUrl(path?: string | null): string {
  if (!path) return "";
  const normalized = path.replace(/\\/g, "/");
  if (/^(https?:|data:|blob:)/i.test(normalized)) return normalized;

  const endpoint = import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1";
  const backendBase = endpoint.replace(/\/api\/v1\/?$/, "");
  return `${backendBase}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
}
