import path from 'path'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'
import { buildApp } from './app'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(dirname, '..')
dotenv.config({
  path: path.join(root, '.env'),
})

const app = buildApp()
export const viteNodeApp = app
