import database from "infra/database.js"

export default async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const queryResultPostgresVersion = await database.query('SELECT version();');
  const postgresVersion = await queryResultPostgresVersion.rows[0].version;

  const queryResultMaxConnections = await database.query('SHOW max_connections;');
  const maxConnections = Number(queryResultMaxConnections.rows[0].max_connections);

  const usedConnections = await database.getUsedConnections()

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        postgres_version: postgresVersion,
        max_connections: maxConnections,
        used_connections: usedConnections
      }
    },
  })
}