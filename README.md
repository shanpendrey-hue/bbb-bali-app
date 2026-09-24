# Nicolle's 50th · Bali 2027 — App v2

This is the rebuilt mobile-first PWA for Nicolle's 50th.

## Included now
- Official BBB colour palette: Olive #556B3F, Nude #D9B89C, Cream #F7F1E6, Brown #6B4E3D.
- Cormorant Garamond + Montserrat hierarchy, with restrained editorial styling.
- Guest-facing Big Bali Bash page only: final itinerary, mystery games wording, cocktail menu, live drink-order test via WhatsApp, catered menu placeholders.
- Sunday 24 Jan sunset RSVP.
- Separate Great Aussie Recovery visual identity and booking section.
- Pizza cart, float cart, massage booking with 2 bookings per 90-minute block.
- Cancel, reschedule and refund-request controls in My Plans.
- Guest profile: name, 4-digit PIN, profile image.
- Bali Ready checklist + document/QR uploads stored locally on the device for this demo.
- Flight details, sharing, airline links and Add to Calendar.
- Live Seminyak weather (Open-Meteo), AUD/IDR converter (Frankfurter), Find Near Me via Google Maps.
- Bali guide accordions and essential app links.
- Browser notification permission + milestone reminders while the PWA/browser is active.
- Installable PWA/offline cache.

## Important production upgrades still required
This demo is intentionally usable without accounts or paid infrastructure, but the following features need a shared backend before guests rely on them:

1. **Shared bookings / inventory**
   - Right now massage inventory is local to one device.
   - To guarantee that a slot cannot be double-booked across guests, connect Supabase/Firebase/another database.

2. **Private travel-wallet storage**
   - Demo uploads are stored on each person's device.
   - Production should use private authenticated object storage. Do not store passport/visa documents in public GitHub/Vercel assets.

3. **Email receipts / refund emails**
   - Connect Resend/Postmark/SendGrid or similar.
   - Stripe can also send payment receipts.

4. **Background push notifications**
   - Browser notifications work in-session now.
   - Reliable scheduled push when the app is closed requires a push service/backend (e.g. Firebase Cloud Messaging or Web Push + scheduled jobs).

5. **WhatsApp automatic staff messages**
   - Current test opens WhatsApp to +61 432 095 292 with the guest's order text prefilled.
   - Automatic messages and sending the guest profile image require WhatsApp Business Cloud API / approved provider and secure backend credentials.

6. **Stripe**
   - Checkout code is included but `CONFIG.stripe` in `app.js` is `false` by default.
   - Add `STRIPE_SECRET_KEY` in Vercel Environment Variables.
   - Lock final prices and decide on a single checkout currency strategy before enabling payments. The current API only whitelists the pizza test item.
   - Refund actions require an authenticated admin endpoint before production.

## Upload to GitHub
Replace your existing app files with everything in this folder, but **do not delete the `.git` folder** in your existing repo.

Then in GitHub Desktop:
1. Review changed files.
2. Commit to `main`.
3. Push origin.
4. Vercel will redeploy automatically.

## Test WhatsApp number
Cocktail orders currently open WhatsApp to: **+61 432 095 292**.
The guest's profile photo remains visible in the app only; a normal `wa.me` link cannot automatically attach that image.

## v3 changes
- Rebuilt BBB pages from the brand system instead of displaying brand-board images.
- Added imagery to cocktail cards and updated Mini Beers copy.
- Great Aussie Recovery uses the supplied final hero artwork and opens itinerary, pizza, massage and float experiences separately.
- Massage availability expanded to six 90-minute blocks (10:00 AM–5:30 PM), four places per block.
- Added Triple J live link, Spotify playlist, Dr Ari, Mobile Medicine, Laundry Bali Express, Travel Card Options (Wise + Revolut), sunset event detail imagery, and photo-upload UI.
- Shared photo storage, shared booking capacity, automated email receipts/refunds and true push notifications still require the production backend/services described below.
