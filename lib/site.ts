// The site's public address. Set NEXT_PUBLIC_SITE_URL once a custom domain exists;
// on Vercel it otherwise falls back to the project's production URL.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
