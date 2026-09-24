# B.B.B Bali App — V5 Master

This is the clean master build based on the exact V5 `app.js` and `styles.css` from the `Rebuild Bali app v5` branch, with only the three requested changes added:

1. The Home-page B.B.B birthday card is visually stronger while keeping its wording/layout intact.
2. Camera Roll includes `Add a photo` plus `View photos`, using the shared Google Drive folder.
3. Chandra Villas includes `Open in Maps`, `Website`, and `Call`.

## Important

The app can open the device photo picker and then the Google Drive folder, but a browser cannot transfer the already-selected files directly into Google Drive without Google OAuth / Drive API integration. Guests still finish the upload inside Google Drive.

## GitHub / Vercel

Keep your repository's `.git` folder. Replace the app files with this package, commit on your safe branch, push, then preview the Vercel deployment before merging into `main`.

If your existing repository contains an `assets` folder (for example `assets/sunset-beanbags.png`), keep it. This package deliberately does not overwrite assets that were not supplied with the V5 source files.
