import fp from 'fastify-plugin'
import {
  FastifyPluginAsync,
} from 'fastify'

export const plugin: FastifyPluginAsync = async (app) => {
  app.decorateRequest('currentUser', null)
}

export const authPlugin = fp(plugin)
