import {
  Global,
  Inject,
  Module,
  type OnApplicationShutdown,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema.js'

export const DB = 'DB'
const PG_CLIENT = 'PG_CLIENT'

export type Database = PostgresJsDatabase<typeof schema>

@Global()
@Module({
  providers: [
    {
      provide: PG_CLIENT,
      inject: [ConfigService],
      // postgres.js connects lazily, so nothing hits the network until the
      // first query.
      useFactory: (config: ConfigService) =>
        postgres(config.getOrThrow<string>('DATABASE_URL')),
    },
    {
      provide: DB,
      inject: [PG_CLIENT],
      useFactory: (client: postgres.Sql) => drizzle(client, { schema }),
    },
  ],
  exports: [DB],
})
export class DbModule implements OnApplicationShutdown {
  constructor(@Inject(PG_CLIENT) private readonly client: postgres.Sql) {}

  async onApplicationShutdown(): Promise<void> {
    await this.client.end()
  }
}
