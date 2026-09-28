import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module.js'
import { env } from './env.js'
import { configureApp } from './setup-app.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  configureApp(app)

  app.enableCors({ origin: env.CORS_ORIGINS, credentials: true })

  // Lets DbModule close the connection pool on SIGTERM.
  app.enableShutdownHooks()

  await app.listen(env.BACKEND_PORT, '0.0.0.0')
}

await bootstrap()
