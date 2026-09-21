import type { NextConfig } from 'next'

const config: NextConfig = {
  // @kp-app/ui ships TypeScript source rather than a build, so Next has to
  // compile it like first-party code instead of treating it as a built dep.
  transpilePackages: ['@kp-app/ui'],
}

export default config
