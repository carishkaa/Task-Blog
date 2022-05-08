import { FastifyPluginAsync } from 'fastify'
import {
  articleDtoIn,
  ArticleDtoIn,
  articleDtoOut,
  articleParamsDtoIn,
  ArticleParamsDtoIn,
  articleShortDtoOut,
} from '../dto/article'

export const articleController: FastifyPluginAsync = async (app) => {
  app.get(
    '/',
    {
      schema: {
        summary: 'List of all articles',
        tags: ['Article'],
        response: { 200: { type: 'array', items: articleShortDtoOut } },
      },
      onRequest: app.authRule.authorized(),
    },
    async () => {
      const articles = await app.db.articles.find()
      return articles
    }
  )

  app.post<{ Body: ArticleDtoIn }>(
    '/',
    {
      schema: {
        summary: 'Create an article',
        tags: ['Article'],
        body: articleDtoIn,
        response: { 200: articleDtoOut },
      },
      onRequest: app.authRule.authorized(),
    },
    async (req) => {      
      const article = await app.db.articles.save(req.body)
      return article
    }
  )

  app.get<{ Params: ArticleParamsDtoIn }>(
    '/:articleId',
    {
      schema: {
        summary: 'Article detail with content and comments',
        tags: ['Article'],
        params: articleParamsDtoIn,
        response: { 200: articleDtoOut },
      },
      onRequest: app.authRule.authorized(),
    },
    async (req, reply) => {
      const article = await app.db.articles.findOne({
        where: { id: req.params.articleId },
        relations: ['comments'],
      })
      return article || reply.notFound('Article not found')
    }
  )

  app.put<{ Body: ArticleDtoIn; Params: ArticleParamsDtoIn }>(
    '/:articleId',
    {
      schema: {
        summary: 'Update article details',
        tags: ['Article'],
        body: articleDtoIn,
        params: articleParamsDtoIn,
        response: { 200: articleShortDtoOut },
      },
      onRequest: app.authRule.authorized(),
    },
    async (req, reply) => {
      const article = await app.db.articles.findOneBy({
        id: req.params.articleId,
      })

      return article
        ? await app.db.articles.save({ ...article, ...req.body })
        : reply.notFound('Article not found')
    }
  )
}
