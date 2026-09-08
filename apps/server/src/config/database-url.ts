// SQLAlchemy-style URLs name the driver inside the scheme
// (postgresql+psycopg://). postgres.js wants a plain postgresql:// URL, so
// strip that suffix if an older .env still carries it.
export const normalizeDatabaseUrl = (url: string): string =>
  url.replace(/^([a-z]+)\+[a-z0-9]+:\/\//i, '$1://')
