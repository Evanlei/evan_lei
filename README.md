# Evan Lei — Portfolio

A personal site where you climb a mountain. Scrolling walks a small climber up a switchback trail, and each camp on the way opens a card: about me, experience, four projects, HackPrinceton, and a summit with contact links.

Built with Next.js (App Router), TypeScript, and plain CSS. Deployed on Vercel.

## What's on the mountain

- **The climb:** the scene is drawn in SVG at runtime: forest, tree line, boulders, snowcap, a fog bank between Veyo and Mochi, and distant ranges with parallax. The camera follows the climber; at the summit it pulls back to show the whole trail.
- **The sky follows New York time:** dawn, day, dusk, or night, with a sun or moon. After dark the climber wears a headlamp.
- **Navigation:** scroll, use ← → / ↑ ↓ / Space / Page Up/Down / Home / End, or click a camp on the minimap. Partway scrolls snap to the next camp.
- **List view:** a plain, readable layout for anyone who just wants the content. It's the default for visitors with reduced motion turned on.
- **Spotify:** a bubble above the climber shows what's playing (or the last track played).
- **Easter egg:** click the climber.

## Editing content

All text, links, dates, and images live in [`lib/content.ts`](lib/content.ts). Project images go in `public/images/`.

## Run it locally

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Then open http://localhost:3000. `npm run build` makes a production build; `npm run typecheck` checks types.

## Spotify setup

The bubble stays hidden until these environment variables are set (locally in `.env.local`, and in Vercel → Project → Settings → Environment Variables). See [`.env.example`](.env.example).

1. Create an app at https://developer.spotify.com/dashboard and add a redirect URI (for example `http://127.0.0.1:3000/callback`).
2. Copy the **Client ID** and **Client Secret** into `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`.
3. Get a refresh token with the scopes `user-read-currently-playing user-read-recently-played`. Open this URL in your browser, sign in, and copy the `code` from the address you land on:
   `https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&scope=user-read-currently-playing%20user-read-recently-played`
4. Exchange the code for tokens and put the `refresh_token` into `SPOTIFY_REFRESH_TOKEN`:
   ```sh
   curl -X POST https://accounts.spotify.com/api/token \
     -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
     -d grant_type=authorization_code -d code=THE_CODE \
     -d redirect_uri=http://127.0.0.1:3000/callback
   ```

The token is only used on the server, in [`app/api/spotify/now-playing`](app/api/spotify/now-playing/route.ts).

## Analytics

Uses Vercel Web Analytics. Turn it on in the Vercel project's **Analytics** tab; it does nothing locally.

## Files

- `app/page.tsx` — the page: HUD, camp cards, and the scene shell
- `app/globals.css` — all styles, light and dark
- `lib/climb-scene.js` — builds the mountain and drives the climb from scroll
- `lib/stage-markup.ts` — the climber drawing and other static scene markup
- `lib/content.ts` — everything a visitor reads
- `lib/spotify.ts`, `app/api/spotify/now-playing/route.ts` — now playing
- `app/opengraph-image.tsx` — the link-preview image
- `app/not-found.tsx` — the 404 page
