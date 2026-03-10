import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 🔴 IMPORTANT: Change 'fuzzymap' to your actual GitHub repository name
const REPO_NAME = 'fuzzy-mapping-tool'

export default defineConfig({
  plugins: [react()],
  base: `/${REPO_NAME}/`,
})
