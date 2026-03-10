# 🎯 FuzzyMap — Data Standardization Tool

A React + Vite web app for fuzzy matching and data standardization.
Runs entirely in the browser — no backend, no server costs.

---

## 🚀 Deploy to GitHub Pages (5 steps)

### 1. Create a GitHub repo
Go to github.com → New repository → name it `fuzzymap` (or anything you like)

### 2. Update the repo name in vite.config.js
Open `vite.config.js` and change this line to match your repo name:
```js
const REPO_NAME = 'fuzzymap'   // ← change to your actual repo name
```

### 3. Push this code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 4. Enable GitHub Pages
- Go to your repo on GitHub
- Settings → Pages
- Source: **GitHub Actions**
- Save

### 5. Done! 🎉
GitHub Actions will automatically build and deploy.
Your app will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

---

## 💻 Run locally (for development)

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## 🏗 Project Structure

```
src/
├── App.jsx                  # Root component, routing
├── main.jsx                 # Entry point
├── index.css                # All styles
├── hooks/
│   └── useAppState.js       # Global state management
├── utils/
│   ├── fuzzy.js             # Fuzzy matching engine
│   └── fileUtils.js         # CSV/Excel read & write
├── components/
│   ├── Sidebar.jsx          # Navigation sidebar
│   └── Toast.jsx            # Toast notifications
└── pages/
    ├── UploadPage.jsx       # Step 1: Upload files
    ├── ConfigurePage.jsx    # Step 2: Column mapping
    ├── ResultsPage.jsx      # Step 3: View results
    ├── CorrectionsPage.jsx  # Step 4: Manual fixes
    └── ExportPage.jsx       # Step 5: Download
```
