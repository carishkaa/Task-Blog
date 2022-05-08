import { FastifyPluginAsync } from 'fastify'
import {
  commentDtoIn,
  CommentDtoIn,
  commentDtoOut,
  commentParamsDtoIn,
  CommentParamsDtoIn,
} from '~/dto/comment'
import { Comment } from '~/entities/comment'

export const commentController: FastifyPluginAsync = async (app) => {
  app.post<{ Body: CommentDtoIn }>(
    '/',
    {
      onRequest: app.authRule.authorized(),
      schema: {
        summary: 'Create comment',
        tags: ['Comment'],
        body: commentDtoIn,
        response: { 200: commentDtoOut },
      },
    },
    async (req, reply) => {
      const article = await app.db.articles.findOneBy({
        id: req.body.articleId,
      })
      if (!article) {
        return reply.notFound('Article not found')
      }

      const comment = new Comment()
      comment.article = article
      comment.author = req.currentUser.name
      comment.content = req.body.content
      if (req.body.parentId) {
        comment.parent = await app.db.comments.findOneByOrFail({
          id: req.body.parentId,
        })
      }
      
      return await app.db.comments.save(comment)
    }
  )

  /**
   * TODO vote by unique IP adresses. Possible solutions:
   * 1) New entity for votes (commentId, voteType (+1 or -1), ip).
   */
  app.post<{ Params: CommentParamsDtoIn }>(
    '/:commentId/vote/up',
    {
      onRequest: app.authRule.public(),
      schema: {
        summary: 'Upvote comment',
        tags: ['Comment'],
        params: commentParamsDtoIn,
      },
    },
    async (req, reply) => {
      const comment = await app.db.comments.findOneBy({
        id: req.params.commentId,
      })
      comment.score += 1
      await app.db.comments.save(comment)
      return reply.send({ score: comment.score })
    }
  )

  app.post<{ Params: CommentParamsDtoIn }>(
    '/:commentId/vote/down',
    {
      onRequest: app.authRule.public(),
      schema: {
        summary: 'Downvote comment',
        tags: ['Comment'],
        params: commentParamsDtoIn,
      },
    },
    async (req, reply) => {
      const comment = await app.db.comments.findOneBy({
        id: req.params.commentId,
      })
      comment.score -= 1
      await app.db.comments.save(comment)
      return reply.send({ score: comment.score })
    }
  )
}
