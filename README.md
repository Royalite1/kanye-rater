# Ye Rater — Kanye West Song & Album Rater

A private site for you and your friends to rate every Kanye West song from **0.0–10.0**, see album means (calculated as the mean of that album's song means), browse each other's individual ratings, and see the combined community mean on the homepage.

Stack: **Next.js** (frontend) + **Supabase** (Postgres database + auth), deployed for free on **Vercel**.

---

## 1. Create your free Supabase project

1. Go to https://supabase.com → sign up (free) → **New project**.
2. Pick any name/region, set a database password (save it somewhere), and wait ~2 minutes for it to spin up.
3. In the left sidebar, go to **SQL Editor** → **New query**.
4. Open `supabase/01_schema.sql` from this project, paste its entire contents in, and click **Run**. This creates the `profiles`, `albums`, `songs`, and `ratings` tables plus all the security rules.
5. New query again → paste `supabase/02_seed.sql` → **Run**. This loads every Kanye album and tracklist. (It's safe to re-run any time you want to reset albums/songs — see the comment at the top of that file.)
6. Go to **Project Settings → API**. You'll need two values for the next step:
   - **Project URL**
   - **anon public** key

### Turn off "confirm email" (optional, recommended for a small friend group)
By default Supabase makes new users click a confirmation email before they can log in. For a quick friends project, you can skip this:
- **Authentication → Providers → Email** → turn off "Confirm email".
If you leave it on, make sure your friends check their inbox (and spam folder) after signing up.

---

## 2. Run it locally

You'll need [Node.js](https://nodejs.org) 18+ installed.

```bash
cd kanye-rater
npm install
cp .env.local.example .env.local
```

Open `.env.local` and paste in your Supabase Project URL and anon key:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Then:

```bash
npm run dev
```

Open http://localhost:3000, sign up, and you should see the full Kanye discography.

---

## 3. Deploy for free on Vercel

1. Push this folder to a new GitHub repo (or upload it directly — Vercel also supports drag-and-drop of a zip via their CLI).
2. Go to https://vercel.com → sign up with GitHub → **Add New Project** → import your repo.
3. In the "Environment Variables" step, add the same two variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. In about a minute you'll get a live URL like `ye-rater.vercel.app` you can send to your friends.

Every time you push a change to GitHub, Vercel redeploys automatically.

---

## How the app works

- **Auth**: Supabase handles sign up / login. On signup, a `profiles` row is created automatically (via a database trigger) storing the username you chose.
- **Rating a song**: On an album page, if you're logged in you get a number box + slider next to every song (0.0–10.0, one decimal place). It saves instantly to the `ratings` table.
- **Album rating**: calculated as the **mean of that album's song means** — exactly as you described (not just an average of every individual rating, so one person spamming ratings on one song can't skew the whole album).
- **Friends page**: lists every signed-up user. Click one to see every album/song with their personal rating, or **N/A** if they haven't rated it.
- **Homepage**: shows the community mean for every album, plus the 5 highest- and lowest-rated songs across everyone.
- Anyone who signs up can see everyone else's ratings (that's the point of a friend-group rater) but can only edit their own — enforced at the database level via Postgres Row Level Security, not just in the app's UI.

### Editing the tracklists
Album/song data lives in `supabase/02_seed.sql`. A few of the newest, still-shifting releases (Donda 2, Vultures 2) only include the most well-known tracks since official tracklists vary by edition — feel free to add rows for deluxe tracks, remove ones you don't care about, or add mixtapes/G.O.O.D. Music compilations the same way.

---

## Ideas for what to add next

- **Half-point emoji reactions** on top of the numeric score (🔥 / 💀) for quick vibes without a full rating.
- **"Rate all" mode**: a stepper that walks you through every unrated song in an album one at a time.
- **Sort/filter** the album page by "your rating" vs. "community mean" to find your biggest disagreements with friends.
- **Biggest disagreements** leaderboard on the homepage — songs with the highest standard deviation between friends' scores.
- **Personal top 10** page, auto-generated from your own highest-rated songs across every album.
- **Comments** on a song rating (a short note on *why* you gave it that score).
- **Era/tag filters** — e.g. tag songs "Old Kanye" vs "New Kanye" or by producer, and rank by tag.
- **Deluxe/bonus track toggle** so the "main" album rating only counts the standard tracklist unless you opt in.
- **Discord bot** or weekly email digest: "Your friend Alex just rated Runaway a 9.8."
- **Import from Spotify/Apple Music** listening history to pre-fill which songs you've actually heard.
