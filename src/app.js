require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const router = require("./routes/home.js");

const port = 3001;


const app = express();

app.set('views', path.join(__dirname, '../views'));

app.set('view engine', 'ejs');


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../scripts")));



app.use("/", router);


// app.listen(process.env.PORT || port, () => {
//     console.log(`Server started on port ${process.env.PORT || port}`);
// });

let connectedToDB = false;

const local_DOMAIN = "http://localhost:3001";
const localDB_URL = "mongodb://localhost:27017/newDB";
//process.env.MONGODB_URI
async function connectMongo() {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}
console.log("Hello!");

(async () => {
    try {
        connectMongo().then(() => {
            console.log("Connected to MongoDB");
            app.listen(process.env.PORT || port, () => {
                console.log(`Server started on port ${process.env.PORT || port}`);
            });
            connectedToDB = true;
        }).catch((err) => {
            connectedToDB = false;
            console.log("Can't connect to Database.");
            console.log(err);
        });

    } catch (error) {
        console.log(error);
    }
})();

module.exports =connectedToDB;
