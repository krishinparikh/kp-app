import { Controller, Get } from '@nestjs/common'
import { healthPath, type HealthResponse } from '@kp-app/contract'

@Controller(healthPath)
export class HealthController {
  @Get()
  health(): HealthResponse {
    return { status: 'ok' }
  }
}
