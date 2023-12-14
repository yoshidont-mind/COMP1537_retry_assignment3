const mongoose = require('mongoose');

// invoke main() to connect to the database and display error if there is any
main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(
        "mongodb+srv://yoshidont-mind:R0iAD7bCwQTMyiZp@yoshidont-mind.1w8adeb.mongodb.net/?retryWrites=true&w=majority"
    );
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// define a schema for the collection
const pokemonSchema = new mongoose.Schema({
    name: {String, required: true},
    type: {Array, required: true},
    base: {Object, required: true}
})

// create a model for the schema
const aPokemonModel = mongoose.model('Pokemon', pokemonSchema);

// enable express
const express = require("express");
const app = express();

// enable cors
const cors = require("cors");
app.use(cors());

// Define a route handler for GET requests to the root URL ('/')
app.get("/", (req, res) => {
    res.sendFile(__dirname + `/../frontend/index.html`);
});

// Define a route handler for GET requests to /pokemon
app.get("/pokemon", async (req, res) => {
    try {
        // set initial query to pass down to db
        const queryToDb = {};

        // set condition for name
        if (req.query.name) {
            queryToPassDownToDb["name.english"] = {
                $in: req.query.name.split(" ").join("").split(","),
            };
        }

        // set condition for type
        if (req.query.type) {
            queryToPassDownToDb.type = {
                $in: req.query.type.split(" ").join("").split(","),
            };
        }

        // set condition for attack
        if (req.query.attackGreaterThan) {
            queryToPassDownToDb["base.Attack"] = {
                $gt: parseInt(req.query.attackGreaterThan),
            };
        }

        // pass down query to db
        const result = await aPokemonModel.find(queryToPassDownToDb);

        // send back result
        res.status(200).json(result);
    } catch (err) {
        if (err.name === "ValidationError") {
            res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: err.message });
    }
});

// start the server listening for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
