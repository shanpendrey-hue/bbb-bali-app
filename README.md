# B.B.B Bali App v6

Rebuilt mobile-first event app for Nicolle's 50th and The Great Aussie Recovery.

## What is included

- B.B.B branding and navigation
- Birthday-cake B.B.B navigation icon
- B.B.B itinerary with fixed mobile spacing
- Cocktail ordering opens 1:30 PM on 25 Jan 2027 and sends the order to WhatsApp
- Camera Roll: Upload a Photo picker + View Photos Google Drive button
- Chandra Villas Maps / Website / Call buttons
- Arrival and departure flight details
- Bali Ready checklist and how-to screens
- YouTube how-to buttons for visa, levy and All Indonesia
- Live Seminyak weather
- Live AUD/IDR converter with a second provider fallback
- Dr Ari number updated to +62 812 3954 567
- Full Bali Guide category pages
- Great Aussie Recovery rebrand using its approved retro palette
- Recovery itinerary fixed for mobile time ranges
- Pizza Party overview -> separate illustrated menu page
- Pizza is the only in-app Stripe cart item
- Massage bookings are cash on the day and saved to My Plans
- Floaties go directly to Get Float Bali website / WhatsApp
- Airport pickup with Made + arrival drinks + cash total
- My Profile includes guest email
- My Plans stores RSVPs, massage bookings, driver requests and paid pizza bookings

## Vercel environment variables

The app will load without these variables, but payments/email notifications will show a clear unavailable message until configured.

### Stripe

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Create a Stripe webhook for:

`https://YOUR-DOMAIN.vercel.app/api/stripe-webhook`

Listen for `checkout.session.completed`.

In Stripe Dashboard, enable successful-payment receipt emails if you want Stripe's own receipt email sent to the guest.

### Email notifications

This build uses Resend for automatic admin + guest confirmation emails.

- `RESEND_API_KEY`
- `EMAIL_FROM` — a sender address/domain verified in Resend

Admin notifications are sent to:

`shanpendrey@gmail.com`

Massage and airport pickup confirmations are emailed to both Shannon and the guest. Pizza admin notification is sent after Stripe confirms payment through the webhook.

## Important operational notes

### Photo uploads

The app's `Upload a photo` button opens the phone camera/photo library, then opens the shared Google Drive folder. A browser cannot silently upload into a Google Drive folder without Google OAuth / Drive API credentials. If you later want one-tap background uploads, connect a Drive upload backend.

### Massage availability

The current demo stores massage bookings on each device. For true shared live capacity across every guest, the booking store needs a small central database (for example Vercel Postgres / Supabase). The UI is already designed for four bookings per 90-minute block.

### Specialty pizzas

The six classic pizzas and dessert are populated from Bali Pizza Party's current menu. The two specialty selections intentionally remain placeholders until the two choices are confirmed.

## Replace your current project

Keep your existing `.git` folder and `.gitattributes` file. Replace the other app files with this package, commit in GitHub Desktop, and Push origin. Vercel should redeploy automatically.
