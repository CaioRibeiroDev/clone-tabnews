import retry from "async-retry";

async function waitForAllServices() {
  await awaitForWebServer();

  async function awaitForWebServer() {
    const result = await retry(fetchStatusPage, {
      retries: 100,
    });

    return result;
  }

  async function fetchStatusPage() {
    try {
      const response = await fetch("http://localhost:3000/api/v1/status");

      console.log("Status: ", response.status)

      if(response.status !== 200) {
        throw new Error(`Status invalido: ${response.status}`);
      }
    } catch (error) {
      console.log("Error fetching status page: ", error.message);
      throw error;
    }
  }
}

const orchestrator = {
  waitForAllServices,
};

export default orchestrator;
