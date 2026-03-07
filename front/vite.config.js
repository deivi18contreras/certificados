import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    // vueDevTools(),
    quasar({
      sassVariables: path.resolve(__dirname, 'src/quasar-variables.sass').replace(/\\/g, '/')
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
