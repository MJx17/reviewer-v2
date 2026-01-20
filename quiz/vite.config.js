import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Reviewer App',
                short_name: 'Reviewer App',
                description: 'Reviewer App',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [{
                        src: '/android-launchericon-192-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/android-launchericon-512-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
        }),
    ],
    build: {
        rollupOptions: {
            // You can add custom rollup options here
            output: {
                manualChunks(id) {
                    // Adjust chunk splitting logic if necessary
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                },
            },
        },
    },
    
});