# Models

Models are the "lowest" application layer, containing modules which talk
directly to the database. No application logic lives here, just persistence
logic.

For the purposes of brevity, this module conflates persistence with domain
models, because Prisma makes this relatively cheap to do. I've opted for
maintainability over strict hexagonal separation of concerns.
