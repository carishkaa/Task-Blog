import { FastifyInstance } from 'fastify'
import { DataSource } from 'typeorm'
import { buildApp } from '../src/app'
import { User } from '../src/entities/user'

const PATH = '/articles'

let app: FastifyInstance
let jwt: string
const EXAMPLE_EMAIL = 'example@example.com'
const EXAMPLE_PASSWORD = 'StrongPassword123'

export const clearDb = async (connection: DataSource) => {
  const entities = connection.entityMetadatas

  for (const entity of entities) {
    const repository = connection.getRepository(entity.name)
    await repository.delete({})
  }
}

beforeAll(async () => {
  process.env.SECRET = 'qwertyuiopasdfghjklzxcvbnm1234567890'
  process.env.NODE_ENV = 'test'

  process.env.DB_HOST = 'localhost'
  process.env.DB_USERNAME = 'admin'
  process.env.DB_PASSWORD = 'admin'

  app = await buildApp()
})

beforeEach(async () => {
  // Create an user
  const user = new User()
  user.name = 'Jan Novak'
  user.email = EXAMPLE_EMAIL
  user.password = EXAMPLE_PASSWORD
  await app.db.users.insert(user)

  // Login
  const res = await app.inject({
    method: 'POST',
    payload: { email: EXAMPLE_EMAIL, password: EXAMPLE_PASSWORD },
    url: '/login',
  })
  jwt = JSON.parse(res.body).jwt
})

afterEach(async () => {
  await clearDb(app.db.connection)
  jwt = ''
})

afterAll(async () => {
  await app.close()
})

describe('Article', () => {
  test(`GET ${PATH}: returns 401 unauthorized without headers`, async () => {
    const res = await app.inject({
      method: 'GET',
      url: PATH,
    })
    expect(res.statusCode).toBe(401)
  })

  test(`GET ${PATH}`, async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/articles',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${jwt}`,
      },
    })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body)).toHaveLength(0)
  })

  test(`POST and PUT ${PATH}`, async () => {
    const article = {
      title: 'Lorem Ipsum',
      perex: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    }

    // Create
    const res = await app.inject({
      method: 'POST',
      url: '/articles',
      payload: article,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${jwt}`,
      },
    })

    const body = JSON.parse(res.body)

    expect(res.statusCode).toBe(200)
    expect(body.title).toBe(article.title)
    expect(body.perex).toBe(article.perex)
    expect(body.content).toBe(article.content)

    // Update
    article.title = 'New Lorum Ipsum'
    const resUpdate = await app.inject({
      method: 'PUT',
      url: `/articles/${body.id}`,
      payload: article, 
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${jwt}`,
      },
    })

    const bodyUpdate = JSON.parse(resUpdate.body)
    expect(resUpdate.statusCode).toBe(200)
    expect(bodyUpdate.title).toBe('New Lorum Ipsum')
  })
})
