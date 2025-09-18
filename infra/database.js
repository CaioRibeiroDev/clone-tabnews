import { Client } from 'pg'

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
  });
  await client.connect();

  try {
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error)
  } finally {
    await client.end();
  }

  
}

export default {
  query: query,
  getUsedConnections: async () => {
    const databaseName = 'local_db'
    const result = await query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName]
    });
    return result.rows[0].count
  }
}