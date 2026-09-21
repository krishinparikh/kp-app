import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import type { CreateUser, UpdateUser, User } from '@kp-app/contract'
import { asc, eq } from 'drizzle-orm'

import { DB, type Database } from '../../db/db.module.js'
import { users } from '../../db/schema.js'

/** Postgres unique_violation — the only constraint on this table is email. */
const UNIQUE_VIOLATION = '23505'

@Injectable()
export class UsersService {
  constructor(@Inject(DB) private readonly db: Database) {}

  list(): Promise<User[]> {
    return this.db
      .select()
      .from(users)
      .orderBy(asc(users.lastName), asc(users.firstName))
  }

  async find(id: string): Promise<User> {
    const [found] = await this.db.select().from(users).where(eq(users.id, id))

    if (!found) throw new NotFoundException(`No user with id ${id}`)
    return found
  }

  async create(input: CreateUser): Promise<User> {
    const [created] = await this.db
      .insert(users)
      .values(input)
      .returning()
      .catch(rethrowDuplicateEmail)

    return created
  }

  async update(id: string, input: UpdateUser): Promise<User> {
    // An empty PATCH would make Drizzle emit invalid SQL, so short-circuit.
    if (Object.keys(input).length === 0) return this.find(id)

    const [updated] = await this.db
      .update(users)
      .set(input)
      .where(eq(users.id, id))
      .returning()
      .catch(rethrowDuplicateEmail)

    if (!updated) throw new NotFoundException(`No user with id ${id}`)
    return updated
  }

  /** Returns the deleted row so every endpoint has a body to parse. */
  async remove(id: string): Promise<User> {
    const [deleted] = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning()

    if (!deleted) throw new NotFoundException(`No user with id ${id}`)
    return deleted
  }
}

function rethrowDuplicateEmail(error: unknown): never {
  if (hasSqlState(error, UNIQUE_VIOLATION)) {
    throw new ConflictException('That email is already registered')
  }
  throw error
}

/**
 * Drizzle wraps driver errors in a DrizzleQueryError and hangs the original
 * off `cause`, so the SQLSTATE isn't on the error you catch. Walk the chain
 * rather than reaching for a fixed depth.
 */
function hasSqlState(error: unknown, code: string): boolean {
  for (let cur: unknown = error; cur instanceof Error; cur = cur.cause) {
    if ('code' in cur && cur.code === code) return true
  }
  return false
}
