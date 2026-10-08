# Edmund Hong

Homepage and planned routing project for **edmundhong.com**. Applications remain in their own repositories and deploy independently.

| Public path | Repository | Upstream path |
| --- | --- | --- |
| `/` | [edmundhong](https://github.com/edmundhong/edmundhong) | Static homepage |
| `/wesplit` and children | [wesplit](https://github.com/edmundhong/wesplit) | Preserve `/wesplit` |

My Trips remains accessible directly at `/mytrips/` through the redirects and proxy routes in `vercel.json`, but is not linked from the homepage or navigation.

## Deployment

Publish changes by fetching the latest GitHub changes, integrating them, then committing and pushing to GitHub. Vercel automatically deploys the production branch. Do not publish directly with the Vercel CLI.

Import this repository into Vercel using the Other framework preset, no build command, and `public` as the output directory. Only `public/` is published.

The initial `vercel.json` serves the homepage only. The application links require the routing configuration below before they work on this project's domain.

1. Deploy WeSplit and obtain its stable production `*.vercel.app` domain. Verify that WeSplit serves `/wesplit` directly.
2. Replace the `REPLACE-WESPLIT` hostnames in `vercel.example.json` with that verified domain, then copy its contents into `vercel.json`.
3. Deploy this project and test `/`, `/apps/`, and `/wesplit` on its Vercel domain. Check application assets, navigation, and WeSplit's API calls as well.
4. Once verified, move the `edmundhong.com` domain assignment from its current Vercel project to this project. Review any `www` alias separately.

Never use `edmundhong.com` as a rewrite destination here: that would route requests back to this project. WeSplit already has Next.js `basePath: '/wesplit'`, so its prefix must be retained.

Routing reference: [Vercel: multiple projects under one domain](https://vercel.com/kb/guide/how-can-i-serve-multiple-projects-under-a-single-domain).

## Local preview

Run `python -m http.server 8000 --directory public` and open `http://localhost:8000`. The apps directory is at `http://localhost:8000/apps/`. Python previews these static pages; it does not apply Vercel proxy rules, so the WeSplit and Formula 1 Lab destinations require the deployed site.

## Homepage design

The homepage and apps directory share `public/styles.css`. Both use local CSS and inline vector illustrations, with no build step or external fonts. The homepage uses a small script to load About Me hashtags from JSON; the initial hashtags remain visible when JavaScript is unavailable or loading fails.

## Editing About Me hashtags

Edit `public/about.json` to add, remove, or reorder entries in the `attributes` array. For example:

```json
{
  "attributes": ["CuriousBuilder", "Traveller", "AlwaysLearning"]
}
```

The page adds `#` automatically, removes spaces, and wraps tags into as many rows as needed on each screen size. Use CamelCase for readable multiword tags. An empty array hides the tags. Preview using the local server above so the browser can load the JSON. The list in `public/index.html` is only a fallback for unavailable JavaScript or a failed JSON request; update it too if you want that fallback to match your latest attributes.

The Instagram card displays the supplied QR screenshot at `public/images/instagram-qr.png` and links to `https://www.instagram.com/edmund_hong/`. CSS frames the white QR card from the original screenshot, hiding the surrounding phone interface. Visitors can scan the QR or click anywhere on the card to open Instagram in a new tab.
