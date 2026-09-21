// Drizzle table definitions go here. Everything exported from this file is
// picked up by `make revision`, which diffs it against the database.
import { date, pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  // A date of birth is a calendar date, not an instant — no time, no timezone.
  // Postgres `date` hands back 'YYYY-MM-DD', which is already the wire format.
  dob: date('dob', { mode: 'string' }).notNull(),
})
