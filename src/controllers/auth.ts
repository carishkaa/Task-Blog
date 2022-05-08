import { FastifyPluginAsync } from 'fastify'
import { loginDtoIn, LoginDtoIn, loginDtoOut } from '~/dto/auth'
import { scryptVerify } from '~/utils/hashers'

export const authController: FastifyPluginAsync = async (app) => {
  app.get(
    '/me',
    {
      onRequest: app.authRule.authorized(),
      schema: {
        summary: 'Get info about currently logged in user',
        tags: ['Auth'],
      },
    },
    async (req) => {
      return req.currentUser
    }
  )

  app.post<{ Body: LoginDtoIn }>(
    '/login',
    {
      onRequest: app.authRule.public(),
      schema: {
        summary: 'Sign in into the application',
        tags: ['Auth'],
        body: loginDtoIn,
        response: { 200: loginDtoOut },
      },
    },
    async (req, reply) => {
      const user = await app.db.users.findOne({
        where: { email: req.body.email },
        select: ['id', 'email', 'password'],
      })

      if (!user) {
        return reply.forbidden('Bad credentials')
      }

      const isPasswordCorrect = await scryptVerify(
        req.body.password,
        user?.password || ''
      )

      if (!isPasswordCorrect) {
        return reply.forbidden('Bad credentials')
      }

      const token = app.jwt.sign({ sub: user.id })
      return { user: user, jwt: token }
    }
  )
}
