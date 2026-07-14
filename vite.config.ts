import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/booking-flow-for-accessibility/',
  build: { outDir: 'dist' },
  // The shared ../jane-nav component is imported from source and has its own
  // node_modules in CI (it pins burrito to "latest" with no lockfile). Without
  // deduping, CI bundles two different burrito versions — jane-nav's newer one
  // emits style tokens (e.g. v1_42_x) that don't exist in this app's pinned CSS,
  // which silently breaks the JaneNavBar styling on the hub deploy. Forcing a
  // single copy keeps the nav tokens consistent.
  resolve: { dedupe: ['@janeapp/burrito-design-system', 'react', 'react-dom'] },
})
