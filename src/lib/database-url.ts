/** Build a valid Prisma/libsql URL (encodes auth tokens for Vercel env vars). */
export function getDatabaseUrl(): string {
  const raw = (process.env.DATABASE_URL ?? "file:./dev.db").trim();
  const tokenFromEnv = process.env.TURSO_AUTH_TOKEN?.trim();

  if (!raw.startsWith("libsql:")) return raw;

  const hostPart = raw.replace(/\?.*$/, "");

  if (tokenFromEnv) {
    return `${hostPart}?authToken=${encodeURIComponent(tokenFromEnv)}`;
  }

  const match = raw.match(/[?&]authToken=(.+)$/);
  if (match) {
    const token = decodeURIComponent(match[1]);
    return `${hostPart}?authToken=${encodeURIComponent(token)}`;
  }

  return raw;
}
