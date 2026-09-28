# 🚀 AstraVital AI - Deployment Guide

This document describes how to deploy **AstraVital AI** to production environments, including **Vercel**, **Railway**, **Render**, and **Supabase**.

---

## 1. Deploying to Railway / Render (Full-Stack with Node.js & SSE)

Railway and Render support long-lived HTTP and Server-Sent Events (SSE) connections required for continuous real-time telemetry streaming.

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "feat: AstraVital AI platform release for NASA Space Apps 2026"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/astravital-ai.git
git push -u origin main
```

### Step 2: Deploy on Railway
1. Log into [Railway.app](https://railway.app).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your `astravital-ai` repository.
4. Add the following Environment Variables in the Railway dashboard:
   - `PORT`: `3000`
   - `NODE_ENV`: `production`
   - `NASA_API_KEY`: *(Optional, defaults to DEMO_KEY or your api.nasa.gov key)*
5. Click **Deploy**. Railway will run `npm install` and `npm start` automatically.
6. Generate a public domain under **Settings → Networking → Generate Domain**.

### Step 3: Deploy on Render
1. Log into [Render.com](https://render.com).
2. Click **New Web Service** and connect your GitHub repository.
3. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `NASA_API_KEY`: *(Your key or DEMO_KEY)*
5. Click **Create Web Service**.

---

## 2. Deploying to Vercel

If deploying the static frontend to Vercel with serverless API functions:

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Run `vercel` in the project root:
   ```bash
   vercel
   ```
3. Set root directory to `./` and ensure `public/` is served as the static output.
4. For full SSE streaming on Vercel, use Vercel Serverless Functions with streaming responses enabled or link the frontend to the Railway backend instance.

---

## 3. Configuring Supabase Cloud Database

To link AstraVital AI with a live Supabase PostgreSQL instance:

1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to the **SQL Editor** tab in your Supabase dashboard.
3. Paste and run the entire contents of [`supabase/schema.sql`](file:///d:/Nasa%20space%202026/supabase/schema.sql).
4. Run [`supabase/seed.sql`](file:///d:/Nasa%20space%202026/supabase/seed.sql) to populate initial astronaut profiles, active missions, and telemetry baselines.
5. In your Railway / Render environment variables, add:
   - `SUPABASE_URL`: `https://YOUR_PROJECT_ID.supabase.co`
   - `SUPABASE_ANON_KEY`: `YOUR_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`: `YOUR_SERVICE_ROLE_KEY`

---

## 4. Production Health Verification

Once deployed, verify that the health check endpoint returns `ONLINE`:
```bash
curl https://your-app-url.railway.app/api/health
```

Expected Response:
```json
{
  "status": "ONLINE",
  "service": "AstraVital AI Deep Space Telemetry Hub",
  "version": "2026.4.1-SpaceApps",
  "activeAstronauts": 4,
  "activeAlerts": 2
}
```
