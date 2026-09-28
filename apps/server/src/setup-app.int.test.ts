import { Test } from '@nestjs/testing'
import { healthPath, usersPath } from '@kp-app/shared'

import { AppModule } from './app.module.js'
import { configureApp } from './setup-app.js'

/**
 * `apiPrefix` in @kp-app/shared is a literal that has to match what
 * `enableVersioning` actually mounts here. Nothing in the type system links
 * them, so this asserts it: every `*Path` a client imports must be a route the
 * server really registered. Needs no database — Drizzle connects lazily.
 */
describe('the URL space', () => {
  let paths: string[]

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    const app = configureApp(moduleFixture.createNestApplication())
    await app.init()

    paths = app
      .getHttpAdapter()
      .getInstance()
      .router.stack.filter((layer: { route?: unknown }) => layer.route)
      .map((layer: { route: { path: string } }) => layer.route.path)

    await app.close()
  })

  it('serves every contract path the client imports', () => {
    expect(paths).toContain(usersPath)
    expect(paths).toContain(healthPath)
  })

  // The API answers on its own host, so the segment would only stutter.
  it('carries no /api segment', () => {
    expect(paths.filter((path) => path.startsWith('/api'))).toEqual([])
  })

  // Probes want one URL a version bump doesn't move.
  it('keeps health outside the version', () => {
    expect(paths).toContain('/health')
    expect(paths).not.toContain('/v1/health')
  })
})
