import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
// GitHub Pages project sites are served from /<repo>/; set GITHUB_PAGES=true in CI when building for Pages.
export default defineConfig({
    base:
        process.env.GITHUB_PAGES === 'true'
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
        reporters: [
            'default',
            ['json', { outputFile: 'reports/vitest-results.json' }],
        ],
    },
})
