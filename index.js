require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));
app.set("view engine", "ejs");

// database connection
const client = require("./database.js");

client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Data logging initiated!");
  }
});

const userTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    phonenumber text NOT NULL UNIQUE,
    password varchar NOT NULL,
    roll text NOT NULL
  );
  `;

client.query(userTable, (err, res) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log("table created!");
  }
});

const dashboardTable = `
  CREATE TABLE IF NOT EXISTS dashboard (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id),
    dash_type text
  );
  `;

client.query(dashboardTable, (err, res) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log("table created!");
  }
});

app.get("/", (req, res) => {
  res.send("Hey from client side!");
});

const signupRoute = require("./cons_material/routes/signupRoute");
app.use(signupRoute);

const loginRoute = require("./cons_material/routes/loginRoute");
app.use(loginRoute);

const dashboardRoute = require("./cons_material/routes/dashboardRoute");
app.use(dashboardRoute);

app.listen("3000", () => {
  console.log("Server Running On Port 3000");
});
