const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const path = require("path");

const router = require("./routes/home.js");

const port = 3001;


var connectedToDB = false;

async function connectMongo() {
    await mongoose.connect("mongodb://localhost:27017/newDB", { useNewUrlParser: true, useUnifiedTopology: true });
}

connectMongo().then(() => {
    console.log("Connected to MongoDB");
    connectedToDB = true;
}).catch((err) => {
    connectedToDB = false;
    console.log("Can't connect");
    console.log(err);
});

const app = express();

app.set('views', path.join(__dirname, '../views'));

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../scripts")));



app.use("/", router);


app.listen(process.env.PORT || port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = connectedToDB;
