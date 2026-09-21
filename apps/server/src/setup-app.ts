import { VersioningType, type INestApplication } from '@nestjs/common'
import { healthResource } from '@kp-app/contract'

/**
 * Everything that shapes the URL space, in one place.
 *
 * Tests build the app with `createNestApplication()`, which never runs
 * `main.ts` — so anything configured only there is silently missing from
 * every e2e test. Keep app-wide setup here and call it from both.
 *
 * `health` opts out of the prefix and of versioning: probes want one stable
 * URL that a version bump doesn't move.
 */
export function configureApp(app: INestApplication): INestApplication {
  app.setGlobalPrefix('api', { exclude: [healthResource] })
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })
  return app
}
