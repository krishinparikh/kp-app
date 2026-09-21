import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { apiErrorBody, healthPath, healthResponse } from '@kp-app/contract'
import request from 'supertest'

import { AppModule } from './../src/app.module.js'

describe('HealthController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('GET /health matches the contract', async () => {
    const response = await request(app.getHttpServer())
      .get(healthPath)
      .expect(200)

    expect(healthResponse.parse(response.body)).toEqual({ status: 'ok' })
  })

  // apiErrorBody is our guess about NestJS's internals. This is what pins the
  // guess to the real framework and breaks loudly if an upgrade reshapes it.
  it('serves errors in the shape the contract describes', async () => {
    const response = await request(app.getHttpServer())
      .get('/does-not-exist')
      .expect(404)

    expect(apiErrorBody.parse(response.body).statusCode).toBe(404)
  })

  afterEach(async () => {
    await app.close()
  })
})
