import { Client } from "pg";

let client: Client | null = null;

(async function () {
  client = new Client({
    host: "localhost",
    database: "lucia_demo_db",
    port: 5430,
    user: "test",
    password: "password",
  });
  await client.connect();
})();

export default client;
