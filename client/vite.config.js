/* global process */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    // GitHub Pages serves your site from `/<repo>/`, so assets must be built with that base.
    // Locally (and most other hosts), `/` is correct.
    base: process.env.GITHUB_PAGES === 'true'
      ? `/${(process.env.GITHUB_REPOSITORY || '').split('/')[1] || 'shopsmart'}/`
      : '/',
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5001',
                changeOrigin: true,
            }
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
        include: ['src/**/*.test.{js,jsx}', 'src/__tests__/**/*.test.{js,jsx}'],
        exclude: ['node_modules', 'tests/e2e/**'],
    },
})
