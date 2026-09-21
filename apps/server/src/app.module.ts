import { Module, StandardSchemaValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_PIPE } from '@nestjs/core'

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
  providers: [
    {
      // Registered here rather than via useGlobalPipes in main.ts: tests build
      // the app with createNestApplication(), which never runs main.ts, so a
      // pipe declared there would be silently absent from every e2e test.
      //
      // Validates any @Body/@Query/@Param given a `schema` and passes
      // everything else through. Schemas come from @kp-app/contract, so the
      // web app checks against the same definitions.
      provide: APP_PIPE,
      useValue: new StandardSchemaValidationPipe({ transform: true }),
    },
  ],
})
export class AppModule {}
