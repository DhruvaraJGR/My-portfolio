# Portfolio site

A static React 19 + Vite portfolio. The production files are generated in `dist/`.

## Local development

- `npm install`
- `npm run dev`
- `npm run check` (production build validation)
- `npm run build`

## Update content

- Edit identity, contact, about, education, certifications, skills, metrics, and asset paths in `src/config/site.js`.
- Edit project content and add real `liveUrl` / `sourceUrl` values in `src/data/projects.js`. Empty URLs intentionally render no links.
- Edit internship details in `src/data/experience.js`.
- Replace `public/assets/portrait.webp` and `public/assets/resume.pdf` to update the portrait and CV.
- Replace `https://your-domain.example/` in `src/config/site.js` and `index.html` with the deployed canonical URL before launch.

## Deploy

**Vercel / Netlify:** set the project root to `site`, install with `npm install`, build with `npm run build`, and publish `dist`.

**GitHub Pages:** for a repository site at `username.github.io/repository-name/`, build with `BASE_PATH=/repository-name/` set in the environment. The output folder is `dist`. For a user/organization site or custom domain, use the default `/` base. Configure the selected base path as a CI environment variable so it is applied to every deployment build.

The contact form opens a prefilled `mailto:` draft in the visitor’s email app; it does not transmit or store submissions.
