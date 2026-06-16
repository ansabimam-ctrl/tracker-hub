# TrackHub

TrackHub is a modern React dashboard foundation for managing leads, proposals, analysis, transactions, notes, and to-do items.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Lucide React
- React Router

## Local Development

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Production Build

```bash
npm run build
```

## GitHub Setup

1. Initialize git:

   ```bash
   git init
   ```

2. Create a new empty repository on GitHub named `trackhub-dashboard`.

3. Connect the local project to GitHub:

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/trackhub-dashboard.git
   ```

4. Commit the project:

   ```bash
   git add .
   git commit -m "Initial TrackHub dashboard foundation"
   ```

5. Push to GitHub:

   ```bash
   git branch -M main
   git push -u origin main
   ```

6. Future deployment suggestion:

   Use Vercel, Netlify, or GitHub Pages. For a Vite app, Vercel and Netlify are the simplest options: connect the GitHub repo, use `npm run build`, and publish the `dist` folder.
