# WHS Husky Tech Website

The public website for WHS Husky Tech, a Hack Club chapter.

## Run locally

This is a plain HTML, CSS, and JavaScript site—no build step is required. From the repository root, serve the site with any static-file server, for example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Project structure

```
.
├── index.html              # Homepage
├── *.html                  # Other public pages, including 404.html
└── assets/
    ├── css/                # Shared styles
    ├── js/                 # Shared behavior and meeting data
    ├── images/             # Deployed brand artwork and stickers
    └── source/             # Original reference artwork and documents
```

## Updating the site

- Edit upcoming meetings in `assets/js/meetings-data.js`.
- Put web-ready photos in `assets/images/` and set the matching `data-src` and `data-alt` values in the page HTML.
- Keep links relative so the site works locally, on GitHub Pages, and on other static hosts.

## Deploy with GitHub Pages

1. Create a GitHub repository and push this folder's `main` branch.
2. In the repository, open **Settings → Pages**.
3. Set the source to **Deploy from a branch**, choose `main`, and select `/(root)`.
4. Save; GitHub publishes the site and serves `404.html` for missing pages.

`.nojekyll` is included so GitHub Pages serves this static site without Jekyll processing.
