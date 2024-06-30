const { Client } = require("pg");
require("dotenv").config();

// Create new PostgreSQL client instance
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Connect to database
client
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Connection error", err.stack)); // Log connection error if any

// Export the client instance for use in index.js
module.exports = client;
