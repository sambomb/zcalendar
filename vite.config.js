
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/zcalendar/',
  server: {
    headers: {
      'X-Frame-Options': 'ALLOWALL',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
})
