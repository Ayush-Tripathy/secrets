const Secret = require("../models/Secrets");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const dbUtils = require("../utils/dbUtils");
const path = require("path");

let connectedToDB = require("../app.js");


const renderPostForm = (req, res) => {
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
}

const savePost = (req, res) => {
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

}

const renderSecrets = async (req, res) => {
    var empty = false;
    if (!connectedToDB) {
        res.render("secrets", { empty: empty, secrets: null, error: true });
    }
    else {
        const cursor = Secret.find({}).cursor();

        let secrets = await dbUtils.toArray(cursor);

        if (secrets.length == 0) {
            empty = true;
        }
        res.render("secrets", { empty: empty, secrets: secrets, error: false });
    }
}

const contactUs = (req, res) => {
    const name = req.body.contactName;
    const email = req.body.contactEmail;
    const subject = req.body.contactSubject;
    const body = req.body.contactBody;

    var transporter = nodemailer.createTransport({
        secure: true,
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: process.env.SECRETS_EMAIL,
            clientId: process.env.SECRETS_CLIENT_ID,
            clientSecret: process.env.SECRETS_CLIENT_SECRET,
            refreshToken: process.env.SECRETS_REFRESH_TOKEN
        }
    });


    ejs.renderFile(path.join(__dirname, "../../views/mailCHtml.ejs"), { name: name, message: body }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mailOptionsForClient = {
                from: process.env.SECRETS_EMAIL,
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
                from: process.env.SECRETS_EMAIL,
                to: process.env.SECRETS_EMAIL,
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

}

const renderCustomPathForm = (req, res) => {
    res.render("custompathcreate");
}

module.exports = { renderPostForm, savePost, renderSecrets, contactUs, renderCustomPathForm };