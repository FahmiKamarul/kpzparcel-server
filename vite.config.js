import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0', // Listen on all network addresses
        hmr: {
            host: '34.124.171.36' // YOUR GOOGLE CLOUD IP ADDRESS
        },
        watch: {
            usePolling: true, // Needed for Docker on Windows/Linux sometimes
        }
    },
});
