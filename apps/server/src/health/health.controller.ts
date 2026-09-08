import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'

import { HealthResponse } from './health.dto.js'

@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({ type: HealthResponse })
  health(): HealthResponse {
    return { status: 'ok' }
  }
}
