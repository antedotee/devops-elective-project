import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
// Production uses VITE_API_BASE_URL=/api so the browser calls the same Express origin as the SPA.
export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5001',
                changeOrigin: true,
            },
        },
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
