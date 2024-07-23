import react from '@vitejs/plugin-react-swc';

import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), dts({ rollupTypes: true, tsconfigPath: './tsconfig.lib.json' })],
    build: {
        lib: {
            entry: path.resolve(__dirname, './src/lib/index.ts'),
            name: 'use-global-disclosure',
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
        sourcemap: true,
        emptyOutDir: true,
    },
});
