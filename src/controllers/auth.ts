import { FastifyPluginAsync } from 'fastify'

export const authController: FastifyPluginAsync = async (app) => {
    app.get('/testt', {onRequest: app.authRule.public() }, async (r,res) => {
        return app.db.articles.find()
      })
}
