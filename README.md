# Evan Lei — portfolio

A standalone version of the approved white portfolio concept. Plain HTML, CSS, and JavaScript; no install or build step.

## Open in VS Code

Choose File → Open Folder… and select this evan-portfolio folder.

## Preview

Double-click index.html in Finder to open it in a browser. Refresh the browser after saving edits in VS Code. Internet access loads the Google font; a system font is used when offline.

## Files

- index.html — introduction, work, about, navigation, and social links
- styles.css — typography, spacing, mobile layout, and transitions
- script.js — animated landscape, typing, section switching, and résumé placeholder

In script.js, the design object controls background motion, line density, and contrast. Text is edited in index.html. If changing the typed introduction, also update the words constant and its aria-label in index.html.

## Add your résumé

Place your PDF beside index.html and name it resume.pdf. In index.html, replace the ew-resume button with:

```html
<a class="ew-resume" href="resume.pdf" download>résumé ↗</a>
```

In script.js, remove the résumé click handler that displays the placeholder toast (the statement beginning root.querySelector('.ew-resume').addEventListener). The toast element in index.html can also be removed.

## Current status

The website includes working Work/About navigation, Sip and social links, email contact, responsive styles, reduced-motion support, and a résumé placeholder. It is saved locally and has not been published. No analytics or backend is configured. The canvas is decorative and built in code.

