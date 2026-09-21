import { Test, TestingModule } from '@nestjs/testing'
import { healthResponse } from '@kp-app/contract'

import { HealthController } from './health.controller.js'

describe('HealthController', () => {
  let controller: HealthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile()

    controller = module.get(HealthController)
  })

  it('returns a body matching the contract', () => {
    expect(healthResponse.parse(controller.health())).toEqual({ status: 'ok' })
  })
})
