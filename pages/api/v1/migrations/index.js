import database from "infra/database"
import migrationRunner from "node-pg-migrate"
import { join } from "node:path"

export default async function migrations(request, response) {
  if(!["GET", "POST"].includes(request.method)) {
    return response.status(405).end() // Method Not Allowed
  }

  let dbClient;

  try {
  dbClient = await database.getNewClient()

  const defaultMigrationsOptions = {
    dbClient,
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  }

  if(request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationsOptions)
    response.status(200).json(pendingMigrations)
  }

  if (request.method === "POST"){
    const migratedMigrations = await migrationRunner({...defaultMigrationsOptions, dryRun: false})
    if(migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations)
    }
    
    response.status(200).json(migratedMigrations)
  }
} catch (error) {
    console.error("Migration error: ", error)
    throw error;
  } finally {
    await dbClient.end()
  }
}