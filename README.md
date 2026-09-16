# Evan Lei — Portfolio

A minimalist portfolio website built with plain HTML, CSS, and JavaScript. The project highlights my work, projects, background, and contact information in a clean editorial layout with a subtle animated landscape and responsive interactions.

## Overview

This portfolio is designed as a lightweight, single-page personal site that can run without any install or build process. It is meant to feel polished, modern, and easy to customize while staying fully static and portable.

## Features

- Responsive single-page portfolio layout
- Animated monochrome landscape background
- Section-based navigation for Work and About
- Social links and email contact
- Lightweight performance with no dependencies
- Accessible, reduced-motion friendly behavior

## Project structure

- `index.html` — page structure, content, navigation, and links
- `styles.css` — layout, typography, spacing, and responsive styling
- `script.js` — animated background, typewriter effect, and navigation behavior

## Local preview

Open `index.html` directly in a browser, or use a local file server if you prefer previewing through a browser environment.

To view it locally:

```bash
python3 -m http.server
```

Then open `http://localhost:8000` in your browser.

## Notes

Contact is available from the third navigation item, or directly through `index.html#contact`. Work and About also have shareable hash links, and browser Back/Forward works between sections. General email, LinkedIn, and GitHub links live only in Contact; Work links directly to the Sip demo and its source code. School and major are included in About, with no repeating footer. Résumés are offered privately on request; no PDF is hosted.

`404.html` matches the portfolio and includes links back home and to each section. Open it directly to preview. When publishing, configure the host to serve this file for missing URLs with HTTP status 404; the page alone does not configure server routing. The built-in Python preview server displays its own error page for missing URLs, so visit `/404.html` to preview the custom design. The 404 page assumes a domain-root deployment; change its `<base href="/">` if deploying under a subfolder.

This project is intentionally static and intentionally does not include analytics, a backend, or deployment automation. It is designed to be easy to host on GitHub Pages, Netlify, or any static hosting provider.

## Contact

Email: el3443@columbia.edu

GitHub: https://github.com/Evanlei
LinkedIn: https://www.linkedin.com/in/evanlei06/
