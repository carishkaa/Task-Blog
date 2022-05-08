import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { DataSource, DataSourceOptions, Repository } from 'typeorm'
import { Article } from '../entities/article'
import { Comment } from '../entities/comment'
import { User } from '../entities/user'

export type ServerDb = {
  connection: DataSource
  articles: Repository<Article>
  comments: Repository<Comment>
  users: Repository<User>
}

const plugin = async (app: FastifyInstance) => {
  const isTestEnv = () => process.env.NODE_ENV === 'test'

  const opts: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: isTestEnv() ? 5433 : 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: isTestEnv() ? 'test' : 'dev',
    synchronize: true,
    dropSchema: isTestEnv(),
    logging: false,
    cache: false,
    entities: [Article, Comment, User],
  }

  const dataSource = new DataSource(opts)
  const connection = await dataSource.initialize()

  const db: ServerDb = {
    connection: connection,
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