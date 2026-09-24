# Nicolle's 50th — The Big Bali Bash

A mobile-first PWA for the January 2027 Bali birthday trip.

## Included now

- BBB branded home screen and countdown
- Chandra Villas details + one-tap maps/call/copy address
- 24 Jan: Beanbags, Beers & Sunset RSVP
- 25 Jan: Big Bali Bash guest page, current food menu, cocktails, games
- 26 Jan: separate Great Aussie Recovery mini-brand
- Australia Day cart with pizza, massage reservations and float hire
- Get Float Bali catalogue sample with real supplier imagery
- Guest profile: name + 4 digit PIN + photo upload
- My Plans + Bali Ready checklist saved on-device
- Live Seminyak weather using Open-Meteo (no API key)
- Live AUD/IDR exchange converter using open.er-api.com (no API key)
- Find-near-me shortcuts for pharmacy, ATM, clinic, supermarket, money changer etc.
- Essential app/logo cards (Gojek, Grab, Bluebird, WhatsApp, Wise, Google Translate)
- Condensed Bali Bearings information in expandable sections
- Official visa / All Indonesia / tourist levy / Smartraveller links and walkthrough videos
- Installable PWA + offline app shell
- Stripe Checkout serverless endpoint ready for Vercel

## Important before live payments

### 1. Choose ONE Stripe settlement currency
Stripe Checkout Sessions cannot contain mixed-currency line items. At the moment:
- Pizza working price is IDR 249,000 pp
- Float working guest price is shown from AUD $8/day

Before launch, choose whether the paid cart should charge everything in AUD or everything in IDR. Update the prices/currency in `app.js` accordingly.

### 2. Add Stripe to Vercel
Create your Stripe account, then in Vercel add:

`STRIPE_SECRET_KEY=sk_live_...` (or `sk_test_...` while testing)

Never put the secret key in `app.js` or GitHub.

The current checkout sends paid items to Stripe. Massage and RSVP selections are included as metadata but are not charged.

## Shared bookings / admin dashboard
The current build saves guest profile, checklist, cart and My Plans in that guest's browser (`localStorage`). This is perfect for the visual build and testing, but it is NOT yet a shared booking database.

Before launch, connect a database (Supabase/Firebase are suitable) so:
- massage time slots cannot be double-booked across different phones
- Nicolle/Shannon can see all RSVPs and bookings in one admin dashboard
- guests can restore plans on another device
- paid Stripe bookings can be reconciled automatically via webhook

The UI has already been designed for this workflow.

## Content still to lock

- Final Sunday 24 beach location / beanbag supplier details
- Final 25 Jan guest timetable
- Final food/menu status if it changes
- Current pharmacy-delivery WhatsApp number
- Current doctor-to-villa WhatsApp number
- Preferred clinic/hospital
- Final float inventory and guest prices
- Final Stripe checkout currency
- Therapist capacity / time-slot rules
- Any shared photo album link
- Any host/admin contacts you want shown

## Deploy

1. Upload all files/folders in this project to the root of the GitHub repository.
2. Make sure `api/create-checkout-session.js` stays inside the `api` folder.
3. Import the GitHub repository into Vercel.
4. Deploy.
5. Add Stripe environment variable later when ready.

## Branding

The CSS uses:
- Cormorant Garamond — headings
- Montserrat — supporting text
- `Brittany Signature` if available, falling back to Allura for script text

The app does not distribute the Brittany font file. If you hold a web licence for it, you can add your licensed font privately later.
