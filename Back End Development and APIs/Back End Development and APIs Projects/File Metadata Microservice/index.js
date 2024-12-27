var express = require("express");
var cors = require("cors");
///
var multer = require("multer");
///
require("dotenv").config();

var app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

///

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" }); // 'uploads/' is the folder where files will be stored temporarily

// Define the POST route to handle file uploads
app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Return file metadata
  res.json({
    name: file.originalname,
    type: file.mimetype,
    size: file.size,
  });
});

///

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
