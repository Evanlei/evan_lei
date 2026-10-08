# Evan Lei — Portfolio

A small personal portfolio built with plain HTML, CSS, and JavaScript. Warm paper tones, muted green links, a portrait, and a compact project list give it its own style.

Subtle CSS effects add a brief staggered entrance, project hover highlight, and moving link arrows. Motion follows the visitor's reduced-motion preference; no animation library is required.

## Content

The page includes About and Projects, featuring Mochi and Veyo. The full project collection is linked on GitHub. Project descriptions were reviewed against the public GitHub repositories on October 7, 2026. Mochi and Veyo are under development. Navigation uses native anchor links; the profile links to GitHub and LinkedIn.

## Local portrait

The original photo stays in the ignored `photo/` folder and is not tracked by Git. The local preview loads it directly. On a checkout without the photo, a small script hides the missing portrait.

To include the photo on a hosted website, supply it separately during deployment or update the image URL to your chosen image host. A photo displayed on a public website is accessible to visitors even if it is excluded from the source repository.

## Preview

Run `python3 -m http.server 8000`, then visit http://localhost:8000. No install or build step is required.

`404.html` shares the site's styles. Configure your host to serve it with HTTP status 404 for missing URLs. Its base URL assumes a domain-root deployment.

## Files

- `index.html` — profile, introduction, and projects
- `styles.css` — layout, typography, and responsive styles
- `script.js` — missing-portrait fallback
- `404.html` — page-not-found design

## Links

- https://github.com/Evanlei
- https://www.linkedin.com/in/evanlei06/
