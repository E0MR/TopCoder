let express = require("express");
var bodyParser = require("body-parser");
let app = express();
var path = require("path");
var dotenv = require("dotenv"); // Import dotenv
dotenv.config(); // Load environment variables from .env file
// or
// var dotenv = require("dotenv").config();

// console.log("Hello, world!");

// app.get("/", function (req, res) {
//   res.send("Hello Express");
// });

// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: false }));

// Example route to test POST requests
app.post("/name", function (req, res) {
  const firstName = req.body.first; // Access parsed data
  const lastName = req.body.last; // Access parsed data
  res.json({ name: `${firstName} ${lastName}` }); // Respond with parsed data
});

// API endpoint to return full name
app.get("/name", function (req, res) {
  const firstName = req.query.first; // Get first name from query string
  const lastName = req.query.last; // Get last name from query string
  const fullName = `${firstName} ${lastName}`; // Combine first and last names
  res.json({ name: fullName }); // Respond with JSON object
});

// Echo server
app.get("/:word/echo", function (req, res) {
  const word = req.params.word; // Extract the word from the route
  res.json({ echo: word }); // Respond with a JSON object
});

// Logger middleware to log method, path, and IP
app.use(function (req, res, next) {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next(); // Call next() to pass control to the next middleware or route handler
});

// Route to serve current time
app.get(
  "/now",
  // Middleware function to add current time
  function (req, res, next) {
    req.time = new Date().toString(); // Add current time to req.time
    next(); // Pass control to the next handler
  },
  // Final handler to send the JSON response
  function (req, res) {
    res.json({ time: req.time });
  }
);

// Mount express.static() to serve static files from the /public folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Serve the JSON object to GET requests on the /json route
app.get("/json", function (req, res) {
  let message = "Hello json";

  // Check the MESSAGE_STYLE environment variable and transform the message
  if (process.env.MESSAGE_STYLE === "uppercase") {
    message = message.toUpperCase();
  }

  res.json({ message: message });
});

// Serve the index.html file on the root path
app.get("/", function (req, res) {
  // res.sendFile(path.join(__dirname, "views", "index.html"));
  res.sendFile("/views/index.html", { root: __dirname });
});

module.exports = app;
