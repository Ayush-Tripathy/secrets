
const express = require("express");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Secret = require("../models/Secrets.js");
const CustomPath = require("../models/CustomPath.js");
const DirectedMessages = require("../models/DirectedMessages.js");
const ListCustomPaths = require("../models/ListCustomPaths.js");
const path = require("path");

const DOMAIN = "http://localhost:3001";
const EMAIL = "secrets.mail.ra@gmail.com";

var connectedToDB = false;

const localDB_URL = "mongodb://localhost:27017/newDB";

async function connectMongo() {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

connectMongo().then(() => {
    console.log("Connected to MongoDB");
    connectedToDB = true;
}).catch((err) => {
    connectedToDB = false;
    console.log("Can't connect to Database.");
    console.log(err);
});

const router = express.Router();

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/choosetype", (req, res) => {
    res.render("choosetype");
});


router.route("/post")
    .get((req, res) => {
        if (req.query.success == "1") {
            res.render("post", { dedication: false, uploadSuccess: true, error: false });
        }
        else if (req.query.error == "1") {
            res.render("post", { dedication: false, uploadSuccess: false, error: true });
        }
        else {
            if (req.query.type == "dTP") {
                res.render("post", { dedication: true, uploadSuccess: false, error: false });
            }
            else if (req.query.type == "sAS") {
                dedication = false;
                res.render("post", { dedication: false, uploadSuccess: false, error: false });
            }
        }
    })
    .post((req, res) => {
        const dedicateTo = req.body.dedicateTo;
        const body = req.body.postBody;
        const dedicated = (dedicateTo == undefined) ? false : true;

        const secret = new Secret({
            dedicated: dedicated,
            dedicatedTo: dedicateTo,
            body: body
        });

        secret.save().then((saved) => {
            res.redirect("/post?success=1");
        }).catch((err) => {
            res.redirect("/post?error=1");
        });

    });

router.get("/secrets", async (req, res) => {
    var empty = false;
    if (!connectedToDB) {
        res.render("secrets", { empty: empty, secrets: null, error: true });
    }
    else {
        const cursor = Secret.find({}).cursor();

        let secrets = await toArray(cursor);

        if (secrets.length == 0) {
            empty = true;
        }
        res.render("secrets", { empty: empty, secrets: secrets, error: false });
    }
});


const toArray = async (cursor) => {
    var arr = [];
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        arr.push(doc);
    }
    return arr;
};

router.post("/contactus", (req, res) => {
    const name = req.body.contactName;
    const email = req.body.contactEmail;
    const subject = req.body.contactSubject;
    const body = req.body.contactBody;

    var transporter = nodemailer.createTransport({
        secure: true,
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: process.env.GOOGLE_APP_KEY,
        }
    });


    ejs.renderFile(path.join(__dirname, "../../views/mailCHtml.ejs"), { name: name, message: body }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mailOptionsForClient = {
                from: EMAIL,
                to: email,
                subject: "Message Sent",
                html: data,
            };
            // console.log("html data ======================>", mailOptionsForClient.html);
            transporter.sendMail(mailOptionsForClient, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('[To client] Message sent: ' + info.response);
                }
            });
        }

    });



    ejs.renderFile(path.join(__dirname, "../../views/mailSHtml.ejs"), { name: name, message: body }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mailOptionsForService = {
                from: EMAIL,
                to: EMAIL,
                subject: subject,
                html: data,
            }
            // console.log("html data ======================>", mailOptionsForService.html);
            transporter.sendMail(mailOptionsForService, function (err, info) {
                if (err) {
                    console.log(err);
                    res.redirect("/");
                } else {
                    console.log('[To admin] Message sent: ' + info.response);
                    res.redirect("/");
                }
            });
        }

    });

});

router.get("/custompathcreate", (req, res) => {
    res.render("custompathcreate");
});

router.get("/custompath/adm/:path", async (req, res) => {

    const pathName = req.params.path.split(" ").join("%20");
    const name = req.params.path;
    const id = req.query.p;

    if (!connectedToDB) {
        res.render("custompath", { customLink: null, empty: false, messages: [], error: true });
    }
    else {
        await ListCustomPaths.findOne({ _id: id }).then(async (doc) => {

            if (doc.name == pathName) {
                const cur = DirectedMessages.find({ id: doc.id }).cursor();

                const messages = await toArray(cur);

                let empty = false;
                if (messages.length == 0) {
                    empty = true;
                }

                res.render("custompath", { name: name, customLink: DOMAIN + doc.customLink, empty: empty, messages: messages, error: false });
            }
            else {
                res.render("custompath", { name: null, customLink: null, empty: false, messages: null, error: true });
            }

        }).catch((err) => {
            res.render("custompath", { name: null, customLink: null, empty: false, messages: null, error: true });
        });
    }


});

router.post("/custompath", async (req, res) => {
    const pathName = req.body.custompathName.split(" ").join("%20");

    const customPath = new CustomPath({
        path: pathName
    });

    await customPath.save().then((saved) => {
        const customLink = "/custompath/" + pathName + "?serial=" + saved.id;

        const admLinkObj = new ListCustomPaths({
            id: saved._id,
            name: pathName,
            customLink: customLink
        });

        admLinkObj.save().then((saved2) => {
            const admLink = "/custompath/adm/" + pathName + "?p=" + saved2._id;
            res.redirect(admLink);
        }).catch((err) => {
            console.log("Some error occurred while saving admLinkObj: " + err);
            res.render("invalid", { message: "Some Error occured.", imgSrc: "/images/error.png" });
        });
    }).catch((err) => {
        console.log("Some error occurred while saving customPathObj:" + err);
        res.render("invalid", { message: "Some Error occured.", imgSrc: "/images/error.png" });
    });

});

router.get("/custompath/:path", async (req, res) => {
    const path = req.params.path.split(" ").join("%20");
    const name = req.params.path;
    const id = req.query.serial;

    await CustomPath.findOne({ _id: id }).then((doc) => {
        if (doc.path == path) {
            res.render("customlink", { success: false, sa: true, notfound: false, error: false, path: path, serial: id, name: name });
        }
        else {
            res.render("customlink", { success: false, sa: false, notfound: true, error: false, path: path, serial: id, name: name });
        }
    }).catch((err) => {
        res.render("customlink", { success: false, sa: false, notfound: true, error: false, path: path, serial: id, name: name });
    });


});

router.post("/custompath/:path", async (req, res) => {
    const path = req.params.path;
    const id = req.query.serial;
    const message = req.body.directedMessage;
    const toSave = req.query.sa; //sa - save again

    const directedMessage = new DirectedMessages({
        id: id,
        message: message
    });

    if (toSave) {
        await directedMessage.save()
            .then(data => {
                res.render("customlink", { success: true, sa: false, notfound: false, error: false, path: path, serial: id });
            })
            .catch(err => {
                res.render("customlink", { success: false, sa: true, notfound: false, error: true, path: path, serial: id });
            });
    }
});

router.get('*', function (req, res) {
    res.render("invalid", { message: "Link is invalid", imgSrc: "/images/invalid.jpg" });
})

module.exports = router;