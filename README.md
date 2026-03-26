Migration
  Generate: npm run migration:generate --name=AddMeaningfulChangeName
  Run: npm run migration:run
  Revert: npm run migration:revert

Notes
  Keep a single reviewed baseline migration for bootstrap on empty databases.
  Baseline migration is schema-only. Seed data is handled separately by `npm run seed`.
  Generate new migrations only after your local database is already at the latest migration state.
  Do not use the default name `Migration`; always pass a descriptive `--name`.

