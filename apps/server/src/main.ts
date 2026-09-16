import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  app.enableCors({
    origin: config.getOrThrow<string[]>('CORS_ORIGINS'),
    credentials: true,
  })

  // Swagger UI at /docs and the raw schema at /openapi.json, which is what the
  // web app's `pnpm gen:api` reads.
  const openApiConfig = new DocumentBuilder()
    .setTitle('kp-app')
    .setVersion('0.0.1')
    .build()
  SwaggerModule.setup(
    'docs',
    app,
    () => SwaggerModule.createDocument(app, openApiConfig),
    { jsonDocumentUrl: 'openapi.json' },
  )

  // Lets DbModule close the connection pool on SIGTERM.
  app.enableShutdownHooks()

  await app.listen(config.getOrThrow<number>('BACKEND_PORT'), '0.0.0.0')
}

await bootstrap()
