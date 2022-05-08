import { exit } from 'process'
import { DataSource, DataSourceOptions } from 'typeorm'
import { Article } from '~/entities/article'
import { User } from '~/entities/user'
import { Comment } from '~/entities/comment'
import faker from '@faker-js/faker'
import _ from 'lodash'

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

async function run() {
  const dataSource = new DataSource(opts)
  const connection = await dataSource.initialize()

  const db = {
    articles: connection.getRepository(Article),
    comments: connection.getRepository(Comment),
    users: connection.getRepository(User),
  }

  const USER_COUNT = 10

  // User data
  const user = new User()
  user.email = 'example@example.com',
  user.name = faker.name.findName(),
  user.password = 'StrongPassword123'
  await db.users.insert(user)
  
  await Promise.all(_.times(USER_COUNT, async (i) => {
    i % 2 && process.stdout.write('.')
    const user = new User()
    user.name = faker.name.findName()
    user.email = faker.internet.email()
    user.password = 'StrongPassword123'
    await db.users.insert(user)
  }))

  await connection.destroy()
}

run()
  .then(() => {
    console.log('Success')

    exit(0)
  })
  .catch((e) => {
    console.error(e)

    exit(1)
  })
