import fp from 'fastify-plugin'
import {
  FastifyPluginAsync,
  onRequestAsyncHookHandler,
  preParsingHookHandler,
} from 'fastify'
import { User } from '~/entities/user'

export enum Rule {
  PUBLIC = 1,
  PRIVATE,
}

export type Guard<T = void> = (t: T) => onRequestAsyncHookHandler

export const guardPublic: Guard = () => {
  return async (req) => {
    req.rule = Rule.PUBLIC
  }
}

export const guardAuthorized: Guard = () => {
  return async (req) => {
    req.rule = Rule.PRIVATE
  }
}

export const plugin: FastifyPluginAsync = async (app) => {
  app.decorate('authRule', {
    public: guardPublic,
    authorized: guardAuthorized,
  })

  app.decorateRequest('currentUser', null)

  const checkAuth: preParsingHookHandler = async (req, reply, payload) => {
    if (!req.routerPath) return payload
    try {
      if (req.rule === Rule.PRIVATE) {
        const decoded = await req.jwtVerify<{ sub: string }>()
        req.currentUser = await app.db.users.findOneByOrFail({ id: decoded.sub })
        return payload 
      } else if (
        req.rule !== Rule.PUBLIC &&
        !req.routerPath.startsWith('/documentation') // Swagger 
      ) {
        return reply.notFound('Permissions are not set for the endpoint')
      }
    } catch (err) {
      return reply.unauthorized()
    }
  }

  app.addHook('preParsing', checkAuth)
}

declare module 'fastify' {
  export interface FastifyInstance {
    authRule: {
      public: typeof guardPublic
      authorized: typeof guardAuthorized
    }
  }

  export interface FastifyRequest {
    currentUser: User
    rule: Rule
  }
}
export const authPlugin = fp(plugin)
