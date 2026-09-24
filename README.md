# B.B.B Bali App v5

Fresh static rebuild for Vercel/GitHub.

## Replace your project files
Keep your existing `.git` folder and `.gitattributes` file. Replace the app files with the contents of this folder.

Expected files:
- index.html
- app.js
- styles.css
- manifest.json
- sw.js
- icon.svg
- vercel.json
- package.json
- assets/sunset-beanbags.png

Then commit to `main` and Push origin in GitHub Desktop. Vercel should redeploy automatically.

## Notes
- Stripe/payment, production email receipts, shared live booking capacity and scheduled push notifications still require backend services.
- Shared photos currently open the supplied Google Drive folder.
