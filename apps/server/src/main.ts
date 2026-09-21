import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module.js'
import { configureApp } from './setup-app.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  configureApp(app)

  app.enableCors({
    origin: config.getOrThrow<string[]>('CORS_ORIGINS'),
    credentials: true,
  })

  // Lets DbModule close the connection pool on SIGTERM.
  app.enableShutdownHooks()

  await app.listen(config.getOrThrow<number>('BACKEND_PORT'), '0.0.0.0')
}

await bootstrap()
