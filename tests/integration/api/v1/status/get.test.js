import orchestrator from 'tests/orchestrator.js'

beforeAll(async () => {
  await orchestrator.waitForAllServices();
})

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString()
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt)

  
  expect(responseBody.dependencies.database.postgres_version).toBeDefined()
  expect(typeof responseBody.dependencies.database.max_connections).toBe('number')
  expect(typeof responseBody.dependencies.database.used_connections).toBe('number')
  })