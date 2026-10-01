# Evan Lei — Portfolio

A simple, content-first portfolio built with plain HTML and CSS, inspired by the straightforward layout of https://enes.web.app.

The page presents a short profile beside a short introduction and project list. It uses system fonts, a white background, subtle blue links, and a stacked layout on mobile. All content is visible without JavaScript. Native anchor links preserve shareable `#about`, `#work` URLs.

## Files

- `index.html` — profile, introduction, and projects
- `styles.css` — responsive layout and shared styles
- `404.html` — matching page-not-found design
- `script.js` — unused placeholder; no JavaScript is required on the portfolio

## Preview

Run `python3 -m http.server 8000`, then visit http://localhost:8000. You can also open `index.html` directly.

Visit `/404.html` to preview the custom error page. Configure your host to serve it with HTTP status 404 for missing URLs. It assumes a domain-root deployment; update its base URL if hosting in a subfolder.

The site has no dependencies, build step, analytics, or backend. Résumés are available privately on request.

## Contact

Email: el3443@columbia.edu

GitHub: https://github.com/Evanlei

LinkedIn: https://www.linkedin.com/in/evanlei06/
