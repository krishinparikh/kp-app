import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { healthPath, healthResponse } from '@kp-app/shared'
import request from 'supertest'

import { AppModule } from './../src/app.module.js'
import { configureApp } from './../src/setup-app.js'

describe('HealthController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = configureApp(moduleFixture.createNestApplication())
    await app.init()
  })

  it('GET /health matches the contract', async () => {
    const response = await request(app.getHttpServer())
      .get(healthPath)
      .expect(200)

    expect(healthResponse.parse(response.body)).toEqual({ status: 'ok' })
  })

  afterEach(async () => {
    await app.close()
  })
})
