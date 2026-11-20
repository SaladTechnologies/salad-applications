import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => {
  // CRA served the app from `PUBLIC_URL` (shell first, then the `.env*` files) and from `/` otherwise: production
  // builds set `/app`, deploy previews and local dev use `/`. Keep the same rule.
  const publicUrl = loadEnv(mode, process.cwd(), 'PUBLIC_URL')['PUBLIC_URL']?.replace(/\/+$/u, '')

  return {
    base: publicUrl === undefined || publicUrl === '' ? '/' : `${publicUrl}/`,
    // The app and the pipeline (`.azure-pipelines/build.ps1`) still use CRA's `REACT_APP_` names.
    envPrefix: 'REACT_APP_',
    plugins: [react()],
    build: {
      // `.azure-pipelines/deploy.ps1` deploys `build/`.
      outDir: 'build',
      // CRA compiled for browserslist `>0.2%, not dead`. Vite's default only covers browsers from 2023 on, so keep the
      // older ES-module baseline (Vite's default before v7) rather than drop users on older Safari and Chrome.
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
      // CRA never inlined SVGs. Vite would inline small ones as `data:` URIs whose quotes and parentheses break the
      // unquoted CSS `url(${...})` values in the app (the Browse Rewards paging arrows).
      assetsInlineLimit: (file: string): false | undefined => (file.endsWith('.svg') ? false : undefined),
    },
    server: {
      port: 3000,
    },
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
    },
  }
})
