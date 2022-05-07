import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { DataSource, DataSourceOptions, Repository } from 'typeorm'
import { Article } from '~/entities/article'
import { Comment } from '~/entities/comment'
import { User } from '~/entities/user'

export type ServerDb = {
  articles: Repository<Article>
  comments: Repository<Comment>
  users: Repository<User>
}

const opts: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'admin',
  database: 'dev',
  synchronize: true,
  dropSchema: false,
  logging: false,
  cache: false,
  entities: [Article, Comment, User],
}

const plugin = async (app: FastifyInstance) => {
  const dataSource = new DataSource(opts)
  const connection = await dataSource.initialize()

  const db: ServerDb = {
    articles: connection.getRepository(Article),
    comments: connection.getRepository(Comment),
    users: connection.getRepository(User)
  }
  
  app.decorate('db', db)

  app.addHook('onClose', async () => {
    await dataSource.destroy()
  })
}

export const dbPlugin = fp(plugin)

declare module 'fastify' {
  export interface FastifyInstance {
    db: ServerDb
  }
}