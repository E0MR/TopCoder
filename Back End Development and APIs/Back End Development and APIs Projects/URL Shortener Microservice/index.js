require("dotenv").config();
const express = require("express");
const cors = require("cors");
///
const dns = require("dns");
const bodyParser = require("body-parser");
///
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
///
// In-memory database for storing URLs
const urlDatabase = [];
let idCounter = 1;
///
app.use(cors());
///
app.use(bodyParser.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded
///
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

///

// URL Shortener API
app.post("/api/shorturl", function (req, res) {
  const originalUrl = req.body.url;

  // Validate URL using dns.lookup
  try {
    const urlObj = new URL(originalUrl); // Validate the URL format
    dns.lookup(urlObj.hostname, (err) => {
      if (err) {
        return res.json({ error: "invalid url" });
      }

      // Store the URL and generate a short ID
      const shortUrl = idCounter++;
      urlDatabase.push({ originalUrl, shortUrl });
      res.json({ original_url: originalUrl, short_url: shortUrl });
    });
  } catch (err) {
    res.json({ error: "invalid url" });
  }
});

// Redirect to the original URL
app.get("/api/shorturl/:shorturl", function (req, res) {
  const shortUrl = parseInt(req.params.shorturl, 10);
  const entry = urlDatabase.find((item) => item.shortUrl === shortUrl);

  if (entry) {
    res.redirect(entry.originalUrl);
  } else {
    res.status(404).json({ error: "No short URL found for the given input" });
  }
});

///

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
