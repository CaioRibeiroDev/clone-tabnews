import database from 'infra/database'
import path from 'path'
import fs from 'fs'

beforeAll(resetDatabase)

async function resetDatabase() {
  await database.query("DROP SCHEMA PUBLIC CASCADE; CREATE SCHEMA PUBLIC;")
}

test("POST to /api/v1/migrations should return 200", async () => {
  const folderPath = path.join(process.cwd(), 'infra/migrations');
  
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response1.status).toBe(201);

  const response1Body = await response1.json();
  expect(response1Body.length).toBeGreaterThan(0)
  expect(Array.isArray(response1Body)).toBe(true)

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();
  expect(Array.isArray(response2Body)).toBe(true)
  console.log('response2Body', response2Body)
  expect(response2Body.length).toBe(0)
  
  const exists = fs.existsSync(folderPath);
  expect(exists).toBe(true);
  const files = fs.readdirSync(folderPath)
  expect(files.length).toBeGreaterThan(0)
  const invalid = files.filter(f => !/^\d+_.+\.js$/.test(f));
  expect(invalid.length).toBe(0);
})