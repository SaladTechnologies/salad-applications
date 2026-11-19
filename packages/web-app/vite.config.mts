import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// CRA served the app from `PUBLIC_URL` when the pipeline set it (production builds use `/app`) and from `/` otherwise
// (deploy previews and local dev). Keep the same rule.
const publicUrl = process.env.PUBLIC_URL?.replace(/\/+$/, '')

export default defineConfig({
  base: publicUrl ? `${publicUrl}/` : '/',
  // The app and the pipeline (`.azure-pipelines/build.ps1`) still use CRA's `REACT_APP_` names.
  envPrefix: 'REACT_APP_',
  plugins: [react()],
  build: {
    // `.azure-pipelines/deploy.ps1` deploys `build/`.
    outDir: 'build',
    // CRA compiled for browserslist `>0.2%, not dead`. Vite's default only covers browsers from 2023 on, so keep the
    // older ES-module baseline (Vite's default before v7) rather than drop users on older Safari and Chrome.
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
  },
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
