# Deployment Guide for GoodTalent OS

This application is built with **React Router 7**, **Vite**, and **Better-SQLite3**.

## Recommended Free Hosting: Render.com

Because this application uses a SQLite database (`better-sqlite3`) and local file storage, standard serverless platforms like Vercel will effectively reset your database every time the server restarts (ephemeral filesystem).

For a free demo that works (with the caveat that data might reset if the server sleeps/restarts), **Render.com** is recommended because it runs the app as a persistent Node.js service.

### Option 1: Deploy to Render (Web Service)

1.  **Push code to GitHub**:
    *   Create a new repository on GitHub.
    *   Run inside this folder:
        ```bash
        git init
        git add .
        git commit -m "Initial commit"
        git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
        git push -u origin main
        ```

2.  **Create Service on Render**:
    *   Go to [dashboard.render.com](https://dashboard.render.com/).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.
    *   **Root Directory**: `login/os/apps/web` (Critical for build success)
    *   **Runtime**: Node
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
    *   **Environment Variables**:
        *   Key: `MISTRAL_API_KEY`
        *   Value: `UdUPEQibkVUis0H2Ec6a9UeiSJYdqThH` (or your key)

### Option 2: Deploy to Vercel (Serverless)

**Warning**: Vercel is a serverless platform. 
1. **Database Issues**: The local `sqlite` file will NOT work for saving data. It will reset on every request or deployment. 
2. **Build Issues**: `better-sqlite3` might fail to compile on Vercel's environment. You may need to remove it or use a specific build configuration.

**Steps:**
1.  Go to [vercel.com/new](https://vercel.com/new).
2.  Import your `OS3` repository.
3.  **Project Settings**:
    *   **Framework Preset**: Select **Vite** or **Remix** (if available).
    *   **Root Directory**: Click "Edit" and select `login/os/apps/web`.
4.  **Environment Variables**:
    *   `MISTRAL_API_KEY`: `UdUPEQibkVUis0H2Ec6a9UeiSJYdqThH`
5.  Click **Deploy**. 

## Important Notes

*   **Database**: The `local.sqlite` file is used for data. In "free" hosting, this file is widely ephemeral. For a real production app, switching to **Neon (Postgres)** or **Turso (LibSQL)** is required.
*   **Uploads**: File uploads go to `public/uploads`. In free hosting, these files disappear on each deployment. Use **UploadThing** or **AWS S3** for production.

## Running Locally

```bash
npm install
npm run dev
```
