import 'reflect-metadata'

import { default as fastify } from 'fastify'
import fastifySensible from '@fastify/sensible'
import fastifyJWT from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'

import { authPlugin } from './plugins/auth'
import { dbPlugin } from './plugins/db'

import { authController } from './controllers/auth'
import { articleController } from './controllers/article'
import { commentController } from './controllers/comment'

export const buildApp = () => {
  const app = fastify({
    ajv: {
      customOptions: {
        removeAdditional: true,
        useDefaults: true,
        nullable: true,
      },
      plugins: [],
    },
    logger: {
      prettyPrint: process.env.NODE_ENV === 'development',
      level: 'warn'
    },
  })

  /**
   * Plugins
   */
  app.register(fastifySensible)
  app.register(fastifyJWT, { secret: process.env.SECRET as string })
  app.register(authPlugin)
  app.register(dbPlugin)

  app.register(fastifySwagger, {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Test swagger',
        description: 'Testing the Fastify swagger API',
        version: '0.1.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      host: 'localhost',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    exposeRoute: true,
  })

  /**
   * Controllers
   */
  app.register(authController)
  app.register(commentController, { prefix: '/comments' })
  app.register(articleController, { prefix: '/articles' })

  return app
}