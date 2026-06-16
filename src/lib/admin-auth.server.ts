import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret() {
  return process.env.ADMIN_JWT_SECRET || "trailbuzz_dev_secret_change_me";
}

function b64url(input: string) {
  return Buffer.from(input).toString("base64url");
}

export function signAdminToken(username: string) {
  const payload = b64url(
    JSON.stringify({ u: username, exp: Date.now() + TOKEN_TTL_MS }),
  );
  const sig = createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token?: string | null): boolean {
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export function assertAdmin(token?: string | null) {
  if (!verifyAdminToken(token)) {
    throw new Error("Unauthorized");
  }
}
