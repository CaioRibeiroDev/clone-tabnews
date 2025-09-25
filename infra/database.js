import { Client } from 'pg'
import dns from 'dns'

dns.setDefaultResultOrder('ipv4first');

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
     ssl: {
      require: process.env.NODE_ENV === 'development' ? false : true,
      rejectUnauthorized: false, // aceita o certificado mesmo sem a CA completa
    },
  });
  
  try {
    await client.connect();
    const result = await client.query(queryObject);
    console.log("CREDENCIAIS DO BANCO DE DADOS", {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
  })
    return result;
  } catch (error) {
    console.error(error)
    throw error;
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