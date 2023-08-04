require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const homeRoutes = require("./routes/home.js");
const customPathRoutes = require("./routes/customPath.js");

const port = process.env.LOCAL_PORT;


const app = express();

app.set('views', path.join(__dirname, '../views'));

app.set('view engine', 'ejs');


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../scripts")));



app.use("/", homeRoutes);
app.use("/custompath", customPathRoutes);
app.get('*', function (req, res) {
    res.render("invalid", { message: "Link is invalid", imgSrc: "/images/invalid.jpg" });
})

let connectedToDB = false;

const databaseURI = (
    process.env.NODE_ENV === "production" ?
        process.env.MONGODB_URI :
        process.env.LOCAL_MONGODB_URI);

async function connectMongo() {
    await mongoose.connect(databaseURI, { useNewUrlParser: true, useUnifiedTopology: true });
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
            console.error("Can't connect to Database.");
            console.error(err);
        });

    } catch (error) {
        console.log(error);
    }
})();

module.exports = connectedToDB;
