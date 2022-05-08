import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'

// todo typeorm https://stackoverflow.com/questions/68570519/why-cant-reflect-metadata-be-used-in-vite
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'fastify',
      appPath: './src/main.ts',
    }),
  ],
})
