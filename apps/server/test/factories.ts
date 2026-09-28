import { createUserBody, type CreateUser } from '@kp-app/shared'

/**
 * A valid CreateUser. Parsed on the way out, so a fixture that drifts from the
 * contract fails here rather than as a confusing assertion downstream. The
 * email is unique per call — these suites don't coordinate.
 */
export const aUser = (overrides: Partial<CreateUser> = {}): CreateUser =>
  createUserBody.parse({
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: `ada-${crypto.randomUUID()}@example.com`,
    dob: '1815-12-10',
    ...overrides,
  })
