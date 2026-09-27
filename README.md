# Edmund Hong

Homepage and planned routing project for **edmundhong.com**. Applications remain in their own repositories and deploy independently.

| Public path | Repository | Upstream path |
| --- | --- | --- |
| `/` | [edmundhong](https://github.com/edmundhong/edmundhong) | Static homepage |
| `/wesplit` and children | [wesplit](https://github.com/edmundhong/wesplit) | Preserve `/wesplit` |
| `/mytrips/` and children | [mytrips](https://github.com/edmundhong/mytrips) | Strip `/mytrips` |

## Deployment

Import this repository into Vercel using the Other framework preset, no build command, and `public` as the output directory. Only `public/` is published.

The initial `vercel.json` serves the homepage only. The application links require the routing configuration below before they work on this project's domain.

1. Deploy WeSplit and My Trips independently and obtain their stable production `*.vercel.app` domains. Verify that WeSplit serves `/wesplit` and My Trips serves `/2026/Nanjing/` directly.
2. Replace the two `REPLACE-*` hostnames in `vercel.example.json` with those verified domains, then copy its contents into `vercel.json`.
3. Deploy this project and test `/`, `/wesplit`, `/mytrips/`, and `/mytrips/2026/Nanjing/` on its Vercel domain. Check application assets, navigation, and WeSplit's API calls as well.
4. Once verified, move the `edmundhong.com` domain assignment from its current Vercel project to this project. Review any `www` alias separately.

Never use `edmundhong.com` as a rewrite destination here: that would route requests back to this project. WeSplit already has Next.js `basePath: '/wesplit'`, so its prefix must be retained. My Trips is static HTML at its deployment root, so its prefix is removed at the proxy. Keep directory URLs ending in `/` so relative journal links resolve correctly; test upstream redirects before switching the domain.

Routing reference: [Vercel: multiple projects under one domain](https://vercel.com/kb/guide/how-can-i-serve-multiple-projects-under-a-single-domain).

## Local preview

Run `python -m http.server 8000 --directory public` and open `http://localhost:8000`. This previews the homepage only; Python does not apply Vercel proxy rules.
