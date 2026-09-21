import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import {
  apiErrorBody,
  user,
  userList,
  usersPath,
  type CreateUser,
} from '@kp-app/shared'
import request from 'supertest'

import { AppModule } from './../src/app.module.js'
import { configureApp } from './../src/setup-app.js'
import { DB, type Database } from './../src/db/db.module.js'
import { users } from './../src/db/schema.js'

// Runs against the real Postgres in compose — `make up` (or `docker compose up
// -d db`) first. Every assertion parses with the contract schema, so a drift
// between what the API sends and what the contract promises fails here.
describe('UsersController (e2e)', () => {
  let app: INestApplication
  let db: Database

  const newUser = (overrides: Partial<CreateUser> = {}): CreateUser => ({
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: `ada-${crypto.randomUUID()}@example.com`,
    dob: '1815-12-10',
    ...overrides,
  })

  const create = async (body: CreateUser = newUser()) => {
    const response = await request(app.getHttpServer())
      .post(usersPath)
      .send(body)
      .expect(201)
    return user.parse(response.body)
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = configureApp(moduleFixture.createNestApplication())
    await app.init()
    db = app.get<Database>(DB)
  })

  afterEach(async () => {
    await db.delete(users)
  })

  afterAll(async () => {
    await app.close()
  })

  it('creates a user and returns the contract shape', async () => {
    const created = await create(newUser({ email: 'ada@example.com' }))

    expect(created).toMatchObject({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      dob: '1815-12-10',
    })
  })

  it('lists users', async () => {
    await create()
    await create()

    const response = await request(app.getHttpServer())
      .get(usersPath)
      .expect(200)

    expect(userList.parse(response.body)).toHaveLength(2)
  })

  it('fetches one by id', async () => {
    const created = await create()

    const response = await request(app.getHttpServer())
      .get(`${usersPath}/${created.id}`)
      .expect(200)

    expect(user.parse(response.body)).toEqual(created)
  })

  it('patches a subset of fields', async () => {
    const created = await create()

    const response = await request(app.getHttpServer())
      .patch(`${usersPath}/${created.id}`)
      .send({ lastName: 'Byron' })
      .expect(200)

    const updated = user.parse(response.body)
    expect(updated.lastName).toBe('Byron')
    expect(updated.firstName).toBe(created.firstName)
  })

  it('deletes and then 404s', async () => {
    const created = await create()

    await request(app.getHttpServer())
      .delete(`${usersPath}/${created.id}`)
      .expect(200)

    const missing = await request(app.getHttpServer())
      .get(`${usersPath}/${created.id}`)
      .expect(404)

    // apiErrorBody is our guess about NestJS's internals. Asserting it here
    // and on the 400 below pins the guess to the real framework, so an
    // upgrade that reshapes the body breaks loudly.
    expect(apiErrorBody.parse(missing.body).statusCode).toBe(404)
  })

  it('rejects a malformed body with 400, in the contract error shape', async () => {
    const response = await request(app.getHttpServer())
      .post(usersPath)
      .send({ firstName: '', lastName: 'X', email: 'nope', dob: 'yesterday' })
      .expect(400)

    expect(apiErrorBody.parse(response.body).statusCode).toBe(400)
  })

  it('rejects an id that is not a uuid with 400', async () => {
    await request(app.getHttpServer()).get(`${usersPath}/abc`).expect(400)
  })

  it('rejects a duplicate email with 409', async () => {
    const body = newUser({ email: 'dupe@example.com' })
    await create(body)

    await request(app.getHttpServer()).post(usersPath).send(body).expect(409)
  })
})
