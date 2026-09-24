# Nicolle's 50th · B.B.B Bali 2027 — v6.2

Mobile-first Vercel app for the Big Bali Bash and Great Aussie Recovery.

## Deploy
Copy the project files into the existing Git repository (keep `.git`), commit, then push `main`. Vercel should deploy automatically when the repository is connected.

## Vercel environment variables
For Stripe pizza checkout:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

For booking/admin emails:
- `RESEND_API_KEY`
- `EMAIL_FROM`

Admin booking notifications currently go to `shanpendrey@gmail.com`.

## Payment paths
- Bali Pizza Party: Stripe checkout.
- Massage: reservation only; cash on the day.
- Airport pickup + arrival drinks: reservation only; cash on delivery.
- Floaties: booked directly with the supplier website/WhatsApp.
