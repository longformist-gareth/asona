import { defineConfig } from 'vite'
import globImporter from 'node-sass-glob-importer'

export default defineConfig(({ mode }) => {
  return {
    base: './',
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          importer: globImporter()
        }
      }
    },
    build: {
      target: 'esnext',
      modulePreload: false,
      manifest: false,
      assetsDir: '',
      outDir: './assets/dist',
      rollupOptions: {
        input: [
          './assets/src/main.js',
          './assets/src/style.scss'
        ],
        output: {
          entryFileNames: '[name].js',
          assetFileNames: (asset) => {
            if (asset.name.includes('style.css')) {
              return '[name].[ext]'
            }

            if (asset.name.includes('.woff2')) {
              return 'fonts/[name].[hash].[ext]'
            }

            if (asset.name.includes(['.svg'])) {
              return 'icons/[name].[hash].[ext]'
            }

            return '[name].[hash].[ext]'
          }
        }
      }
    }
  }
})
