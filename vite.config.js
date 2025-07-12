import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@': '/src',
      '@features': '/src/Features',
      '@components': '/src/components'
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  server: {
    proxy: {
      '/api': 'http://Tatutallerapp-env.eba-txcpu5py.us-east-1.elasticbeanstalk.com'
    }
  }
})
