// lib/request.ts
export function getClientInfo(req: Request) {
  const xfwd = req.headers.get("x-forwarded-for");
  const ip =
    (req as any).ip ??
    (xfwd ? xfwd.split(",")[0].trim() : undefined) ??
    undefined; // vẫn có thể undefined

  const ua = req.headers.get("user-agent") ?? "";
  return { ip: ip ?? "", ua };
}
