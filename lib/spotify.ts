// Server-only Spotify helpers. Credentials come from environment variables and never reach the browser.
// Required scopes for the refresh token: user-read-currently-playing user-read-recently-played

export type NowPlaying = {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumArt: string | null;
  url: string;
};

type SpotifyImage = { url: string; width: number | null };
type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  album: { images: SpotifyImage[] };
  external_urls: { spotify: string };
};

async function getAccessToken(): Promise<string | null> {
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) return null;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

function toNowPlaying(track: SpotifyTrack, isPlaying: boolean): NowPlaying {
  // Smallest image that is still at least 64px wide; Spotify lists largest first.
  const images = track.album.images ?? [];
  const art = [...images].reverse().find((img) => (img.width ?? 0) >= 64) ?? images[0];
  return {
    isPlaying,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    albumArt: art?.url ?? null,
    url: track.external_urls.spotify,
  };
}

/** What Evan is playing now, or the last track played. Null when Spotify is not configured or unreachable. */
export async function getNowPlaying(): Promise<NowPlaying | null> {
  const token = await getAccessToken();
  if (!token) return null;
  const headers = { Authorization: `Bearer ${token}` };

  const current = await fetch("https://api.spotify.com/v1/me/player/currently-playing", { headers, cache: "no-store" });
  if (current.status === 200) {
    const data = (await current.json()) as { is_playing: boolean; currently_playing_type: string; item: SpotifyTrack | null };
    if (data.item && data.currently_playing_type === "track") return toNowPlaying(data.item, data.is_playing);
  }

  const recent = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", { headers, cache: "no-store" });
  if (!recent.ok) return null;
  const history = (await recent.json()) as { items?: { track: SpotifyTrack }[] };
  const last = history.items?.[0]?.track;
  return last ? toNowPlaying(last, false) : null;
}
