import { Client } from 'pg'
import dns from 'dns'

dns.setDefaultResultOrder('ipv4first');

async function query(queryObject) {
  let client;
  
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
   
    return result;
  } catch (error) {
    console.error(error)
    throw error;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
    const client = new Client({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      ssl: getSSLValues(),
    });

    await client.connect();
    return client;
}  

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    }
  }

  return process.env.NODE_ENV === 'production' ?  true : false
}

export default {
  query,
  getNewClient,
  getUsedConnections: async () => {
    const databaseName = 'local_db'
    const result = await query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName]
    });
    return result.rows[0].count
  }
}