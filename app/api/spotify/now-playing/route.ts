import { getNowPlaying } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  let track = null;
  try {
    track = await getNowPlaying();
  } catch {
    // Spotify being down should only hide the bubble, never break the page.
  }
  return Response.json(track ?? {}, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  });
}
