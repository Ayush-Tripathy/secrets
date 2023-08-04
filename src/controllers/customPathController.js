const CustomPath = require("../models/CustomPath");
const DirectedMessages = require("../models/DirectedMessages");
const ListCustomPaths = require("../models/ListCustomPaths");
const dbUtils = require("../utils/dbUtils");

let connectedToDB = require("../app.js");

const DOMAIN = (process.env.NODE_ENV === "production" ?
    process.env.DOMAIN :
    process.env.LOCAL_DOMAIN);

const renderAdmPage = async (req, res) => {
    //console.log(req.cookies);
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

                const messages = await dbUtils.toArray(cur);

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
}

const createCustomPath = async (req, res) => {

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

            var after1day = new Date(new Date().getTime() + (1000 * 60 * 60 * 24));
            // var after1day = 1000 * 60 * 60 * 24;
            res.cookie("customurl", admLink, { expires: after1day });
            res.redirect(admLink);
        }).catch((err) => {
            console.log("Some error occurred while saving admLinkObj: " + err);
            res.render("invalid", { message: "Some Error occured.", imgSrc: "/images/error.png" });
        });
    }).catch((err) => {
        console.log("Some error occurred while saving customPathObj:" + err);
        res.render("invalid", { message: "Some Error occured.", imgSrc: "/images/error.png" });
    });

}

const renderCustomPath = async (req, res) => {
    const path = req.params.path.split(" ").join("%20");
    const name = req.params.path;
    const id = req.query.serial;

    var L_C_P_ID = "";
    if (req.cookies.customurl != undefined) {
        L_C_P_ID = req.cookies.customurl.split("=")[1];
    }
    //console.log(L_C_P_ID)

    await CustomPath.findOne({ _id: id }).then((doc) => {
        if (doc.path == path) {

            ListCustomPaths.findOne({ id: id }).then(d2 => {
                //console.log(d2._id);
                if (d2 != null && d2._id == L_C_P_ID) {
                    res.redirect(req.cookies.customurl);
                }
                else {
                    res.render("customlink", { success: false, sa: true, notfound: false, error: false, path: path, serial: id, name: name });
                }
            });
        }
        else {
            res.render("customlink", { success: false, sa: false, notfound: true, error: false, path: path, serial: id, name: name });
        }
    }).catch((err) => {
        res.render("customlink", { success: false, sa: false, notfound: true, error: false, path: path, serial: id, name: name });
    });


}

const sendMessage = async (req, res) => {
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
}

module.exports = { renderAdmPage, createCustomPath, renderCustomPath, sendMessage };