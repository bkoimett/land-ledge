# Deploy to Vercel

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the following settings:

### 3. Configuration Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `client/` |
| **Build Command** | `npm run build` (auto-detected) |
| **Output Directory** | `.next` (auto-detected) |
| **Install Command** | `npm install` (auto-detected) |

### 4. Environment Variables

No environment variables are required. The app uses mock data only.

### 5. Deploy

Click "Deploy" and wait for the build to complete.

## One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/import)

## Post-Deployment

After deployment, your app will be available at:
- `https://your-project-name.vercel.app`

## Demo Flow

1. Visit the deployed URL
2. Click "Connect Wallet" in the navbar
3. Go to Register and register a new land
4. Go to Verify and search for your land ID
5. Go to Transfer and transfer to a new address
6. Go to History to see the ownership timeline

## Notes

- All data is client-side only and resets on page refresh
- No backend API or database required
- Transaction hashes link to Polygonscan (for demo purposes only)