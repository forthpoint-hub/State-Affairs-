# State Affairs

An independent political and current-affairs publication for Bangladesh and
international coverage, with a mobile CMS you run entirely from Safari on
your iPhone.

This guide assumes **zero computer access**. Every step below works in
Safari on iOS.

---

## What you're setting up

1. **GitHub** — holds the code
2. **Supabase** — the database, auth, and image storage
3. **Vercel** — hosts the live website, redeploys automatically when you push code, and runs the article-publishing cron job

You do this once. After that, publishing articles never touches any of these — you just use `/admin` on your own site.

---

## Step 1 — Create a GitHub repository (Safari)

1. Go to **github.com**, sign in (or create a free account).
2. Tap **+** → **New repository**. Name it `state-affairs`. Keep it Private if you prefer. Create it.
3. On the new repo's page, tap **Add file → Upload files**.
4. Upload every file from the `state-affairs` project you downloaded from this chat, keeping the folder structure intact (Safari's file picker lets you select the whole unzipped folder — if it flattens folders, use the GitHub mobile app instead, which handles nested uploads better; download it free from the App Store, sign in, and use "Add file" from within the app).
5. Commit the files to the `main` branch.

*(If uploading a full folder tree from Safari is fiddly, the GitHub app is genuinely easier for this one-time step.)*

---

## Step 2 — Create your Supabase project

1. Go to **supabase.com**, sign in, tap **New project**.
2. Name it `state-affairs`, set a strong database password (save it somewhere), pick a region close to Bangladesh (e.g. Singapore), create the project. It takes a minute or two to provision.
3. Once it's ready, open the **SQL Editor** (left sidebar).
4. Open `supabase/schema.sql` from your uploaded repo (view the raw file on GitHub, select all, copy).
5. Paste the whole thing into the Supabase SQL Editor and tap **Run**. This creates every table, relationship, and security rule in one go.
6. Go to **Storage** (left sidebar) → **New bucket**. Name it exactly `media`. Toggle **Public bucket** ON (so article images load on the public site). Create it.
7. Go to **Authentication → Users** → **Add user**. Enter your own email and a password — this is how you'll log into `/admin`.
8. Copy that new user's **User UID**.
9. Back in the **SQL Editor**, run:
   ```sql
   insert into admins (id, name) values ('PASTE-THE-USER-UID-HERE', 'Your Name');
   ```
   This is what actually grants that login access to the CMS — without this row, the login will work but `/admin` will redirect you away.
10. Go to **Project Settings → API**. Copy three values, you'll need them in Step 3:
    - **Project URL**
    - **anon public key**
    - **service_role key** (tap "reveal" — keep this one secret, never share it)

---

## Step 3 — Deploy to Vercel

1. Go to **vercel.com**, sign in with your GitHub account.
2. Tap **Add New → Project**, select your `state-affairs` GitHub repo, tap **Import**.
3. Before deploying, expand **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon public key |
   | `SUPABASE_SERVICE_ROLE_KEY` | your Supabase service_role key |
   | `NEXT_PUBLIC_SITE_URL` | your eventual site URL, e.g. `https://state-affairs.vercel.app` |
   | `CRON_SECRET` | any long random string you make up — e.g. mash your keyboard for 30 characters |

4. Tap **Deploy**. Vercel builds and hosts the site — this takes a few minutes the first time.
5. Once live, open the deployed URL. You should see an empty Bangladesh/World home page (no articles yet — that's expected).
6. Go to `your-site.vercel.app/admin/login` and sign in with the email/password you created in Supabase Step 2.7.

You're now in the CMS. Every future article you publish appears on the live site immediately — no redeploy, no waiting.

---

## Everyday workflow (from now on)

Open Safari → your-site.com/admin → **New Article** → write, add an image,
pick category/author → **Publish**. Done — it's live.

To schedule something for later (e.g. 8:00 PM), fill in the "Schedule for"
field and tap **Schedule** instead of Publish. Vercel's cron job checks
every 5 minutes and flips it live automatically at that time.

---

## Adding more authors or categories later

- **Authors**: currently added via Supabase's Table Editor (`authors` table)
  from Safari — tap **Insert row**, fill in name/slug/bio/photo URL.
- **Categories**: same idea, in the `categories` table, if you want anything
  beyond Politics/Economy/Others.

A dedicated CMS screen for these can be added later — the database is
already structured to support it without any redesign.

---

## Notes

- Never share your `service_role` key or paste it into anything except
  Vercel's environment variables — it bypasses all database security rules.
- The `media` Storage bucket must stay **public** or images won't load on
  the site.
- If you ever want a custom domain instead of `*.vercel.app`, that's done
  in Vercel → your project → **Settings → Domains**, also fully doable from
  Safari.
