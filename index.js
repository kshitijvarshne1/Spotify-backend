const express = require("express");
const mysql = require("mysql");

// create connection

const db = mysql.createConnection({
  host: "localhost",
  user: "kshitijdb",
  password: "root@123",
  insecureAuth: true,
  database: "spotifydb",
});
// connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Mysql connected.......");
});

const app = express();

app.get("/", (req, res) => {
  res.send({ status: "working" });
});

app.listen("3000", () => {
  console.log("Server started on port 3000");
});
