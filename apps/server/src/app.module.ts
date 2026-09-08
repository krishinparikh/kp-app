import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { validateEnv } from './config/env.js'
import { DbModule } from './db/db.module.js'
import { HealthModule } from './health/health.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // The repo root .env is the single source of truth. It's absent inside
      // the container, where compose injects these as real environment
      // variables.
      envFilePath: '../../.env',
      validate: validateEnv,
    }),
    DbModule,
    HealthModule,
  ],
})
export class AppModule {}
