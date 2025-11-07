import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [{
        src: 'src/locales',
        dest: '',
        rename: '_locales',
      }],
    }),
  ],
  publicDir: './static',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        api: './src/app/extension/api.ts',
        background: './src/app/extension/background.ts',
        settings: './src/app/extension/settings.ts',
      },
      output: {
        entryFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
})
