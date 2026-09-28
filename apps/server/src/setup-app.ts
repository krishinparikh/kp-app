import { VersioningType, type INestApplication } from '@nestjs/common'

/**
 * Everything that shapes the URL space, in one place.
 *
 * Tests build the app with `createNestApplication()`, which never runs
 * `main.ts` — so anything configured only there is silently missing from
 * every e2e test. Keep app-wide setup here and call it from both.
 *
 * There is no `/api` segment: the API answers on its own host, so the segment
 * would only stutter. `health` opts out of versioning on its own controller
 * with VERSION_NEUTRAL — probes want one URL a version bump doesn't move.
 */
export function configureApp(app: INestApplication): INestApplication {
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })
  return app
}
