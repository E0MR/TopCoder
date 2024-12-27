const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
///
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// In-memory storage
const users = [];
const exercises = [];
///
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

///

// Create a new user
app.post("/api/users", (req, res) => {
  const { username } = req.body;
  const newUser = { username, _id: users.length + 1 + "" }; // Use a simple string ID
  users.push(newUser);
  res.json(newUser);
});

// Get a list of all users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// Add exercises
app.post("/api/users/:_id/exercises", (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  const user = users.find((u) => u._id === _id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const exercise = {
    userId: _id,
    description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
  };

  exercises.push(exercise);

  res.json({
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date,
    _id: user._id,
  });
});

// Get user's exercise log
app.get("/api/users/:_id/logs", (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const user = users.find((u) => u._id === _id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  let userExercises = exercises.filter((ex) => ex.userId === _id);

  if (from || to) {
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    userExercises = userExercises.filter((ex) => {
      const exerciseDate = new Date(ex.date);
      return (
        (!fromDate || exerciseDate >= fromDate) &&
        (!toDate || exerciseDate <= toDate)
      );
    });
  }

  if (limit) {
    userExercises = userExercises.slice(0, parseInt(limit));
  }

  res.json({
    username: user.username,
    count: userExercises.length,
    _id: user._id,
    log: userExercises.map((ex) => ({
      description: ex.description,
      duration: ex.duration,
      date: ex.date,
    })),
  });
});

///

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
