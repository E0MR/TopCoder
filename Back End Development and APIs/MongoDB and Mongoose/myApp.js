const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

let Person;

// Define the schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Required string
  age: { type: Number }, // Optional number
  favoriteFoods: { type: [String] }, // Array of strings
});

// Create the model
Person = mongoose.model("Person", personSchema);

// const createAndSavePerson = (done) => {
//   done(null /*, data*/);
// };

const createAndSavePerson = (done) => {
  // Create a new person instance
  const newPerson = new Person({
    name: "Jane Doe",
    age: 25,
    favoriteFoods: ["Pasta", "Ice Cream"],
  });

  // Save the document to the database
  newPerson.save((err, data) => {
    if (err) return done(err); // Handle any error
    done(null, data); // Pass the saved document as data
  });
};

// const createManyPeople = (arrayOfPeople, done) => {
//   done(null /*, data*/);
// };

const createManyPeople = (arrayOfPeople, done) => {
  // Use Model.create to save multiple documents at once
  Person.create(arrayOfPeople, (err, data) => {
    if (err) {
      return done(err); // Handle any error
    }
    done(null, data); // Return the saved documents as data
  });
};

// const findPeopleByName = (personName, done) => {
//   done(null /*, data*/);
// };

const findPeopleByName = (personName, done) => {
  // Use Model.find() to search for people with the given name
  Person.find({ name: personName }, (err, data) => {
    if (err) {
      return done(err); // Handle any error
    }
    done(null, data); // Return the array of people that matched the query
  });
};

// const findOneByFood = (food, done) => {
//   done(null /*, data*/);
// };

const findOneByFood = (food, done) => {
  // Use Model.findOne() to find one person with the given food in their favorites
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) {
      return done(err); // Handle any error
    }
    done(null, data); // Return the found person (or null if not found)
  });
};

// const findPersonById = (personId, done) => {
//   done(null /*, data*/);
// };

const findPersonById = (personId, done) => {
  // Use Model.findById() to find the person by their _id
  Person.findById(personId, (err, data) => {
    if (err) {
      return done(err); // Handle any error
    }
    done(null, data); // Return the person found, or null if not found
  });
};

// const findEditThenSave = (personId, done) => {
//   const foodToAdd = "hamburger";

//   done(null /*, data*/);
// };

const findEditThenSave = (personId, done) => {
  // Step 1: Find the person by _id
  Person.findById(personId, (err, person) => {
    if (err) {
      return done(err); // Handle any error
    }

    if (!person) {
      return done(null, null); // If no person is found, return null
    }

    // Step 2: Add "hamburger" to the favoriteFoods array
    person.favoriteFoods.push("hamburger");

    // Step 3: Save the updated person
    person.save((err, updatedPerson) => {
      if (err) {
        return done(err); // Handle any error during save
      }
      done(null, updatedPerson); // Return the updated person
    });
  });
};

// const findAndUpdate = (personName, done) => {
//   const ageToSet = 20;

//   done(null /*, data*/);
// };

const findAndUpdate = (personName, done) => {
  // Use findOneAndUpdate to find a person by name and update their age
  Person.findOneAndUpdate(
    { name: personName }, // Search query
    { age: 20 }, // Update action
    { new: true }, // Option to return the updated document
    (err, updatedPerson) => {
      if (err) {
        return done(err); // Handle any error
      }
      done(null, updatedPerson); // Return the updated person document
    }
  );
};

// const removeById = (personId, done) => {
//   done(null /*, data*/);
// };

const removeById = (personId, done) => {
  // Use findByIdAndRemove to delete the person by their _id
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) {
      return done(err); // Handle any error
    }
    done(null, removedPerson); // Return the removed person (if found), or null if not found
  });
};

// const removeManyPeople = (done) => {
//   const nameToRemove = "Mary";

//   done(null /*, data*/);
// };

const removeManyPeople = (done) => {
  const nameToRemove = "Mary"; // The name to remove

  // Use Model.remove() to delete all people with the given name
  Person.remove({ name: nameToRemove }, (err, result) => {
    if (err) {
      return done(err); // Handle any error
    }
    done(null, result); // Return the result of the removal operation
  });
};

// const queryChain = (done) => {
//   const foodToSearch = "burrito";

//   done(null /*, data*/);
// };

const queryChain = (done) => {
  const foodToSearch = "burrito"; // The food to search for

  // Build the query using method chaining
  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 }) // Sort by name in ascending order
    .limit(2) // Limit the result to 2 documents
    .select("-age") // Exclude the 'age' field from the result
    .exec((err, data) => {
      if (err) {
        return done(err); // Handle any error
      }
      done(null, data); // Return the query results
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
