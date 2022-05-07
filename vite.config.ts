import path from 'path'
import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'

// todo typeorm https://stackoverflow.com/questions/68570519/why-cant-reflect-metadata-be-used-in-vite
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  server: {
    port: 3000,
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'fastify',
      appPath: './src/app.ts',
    }),
  ],
})
