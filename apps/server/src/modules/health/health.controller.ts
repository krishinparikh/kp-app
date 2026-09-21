import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common'
import { healthResource, type HealthResponse } from '@kp-app/shared'

@Controller({ path: healthResource, version: VERSION_NEUTRAL })
export class HealthController {
  @Get()
  health(): HealthResponse {
    return { status: 'ok' }
  }
}
