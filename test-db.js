import pg from "pg";

const { Client } = pg;

const connectionString =
  process.env.PAYLOAD_DATABASE_URI || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Missing database connection string. Set PAYLOAD_DATABASE_URI or DATABASE_URL before running test-db.js."
  );
}

const client = new Client({ connectionString });

async function testDB() {
  try {
    await client.connect();

    const { rows } = await client.query(
      `select id, title, thumbnail_url, gallery_images, visibility
       from portfolio_items
       where visibility = $1
       limit 10`,
      ["public"]
    );

    console.log("Portfolio items:", JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error("Error:", error);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

testDB();
