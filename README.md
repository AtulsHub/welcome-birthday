# Birthday Thank-You Site

    npm install
    npm run dev      # http://localhost:3000

Personalised links: http://localhost:3000/?name=Rahul
Edit the CONFIG block at the top of components/Site.js (your name, message, secret, counters).
Deploy: push to GitHub and import into Vercel.

## MongoDB visitor tracking

1. Copy `.env.example` to `.env.local`.
2. Set `MONGODB_URI` to your MongoDB connection string.
3. Set `ADMIN_PASSWORD` to a strong private password.
4. Open `/admin`, enter the password, and view visitor names.
