const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const path = require("path");

const router = require("./routes/home.js");

const port = 3001;


var connectedToDB = false;

const username = "ayushtripathy547";
const DB_NAME = "secretsDB";

const MONGODB_URL = `mongodb+srv://${username}:${process.env.MONGODB_PASS}@cluster0.gnkjn1v.mongodb.net/${DB_NAME}`;

const localDB_URL = "mongodb://localhost:27017/newDB";

async function connectMongo() {
    await mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
}

connectMongo().then(() => {
    console.log("Connected to MongoDB");
    connectedToDB = true;
}).catch((err) => {
    connectedToDB = false;
    console.log("Can't connect to Database.");
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
    console.log(`Server started on port ${process.env.PORT || port}`);
});

module.exports = connectedToDB;
