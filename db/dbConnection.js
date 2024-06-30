const { Client } = require("pg");
require("dotenv").config();

// Database connection configuration
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Connect to the database
client
  .connect()
  .then(() => {
    console.log("Connected to the database");

    // Test query
    // const query = "SELECT * FROM employees";
    // return client.query(query);
  })
  .then((res) => {
    console.log("Query results:", res.rows);
  })
  .catch((err) => {
    console.error("Error executing query:", err.stack);
  })
  .finally(() => {
    // Close the database connection
    client.end();
  });
