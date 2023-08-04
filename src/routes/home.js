const express = require("express");
const homeController = require("../controllers/homeController.js");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("home");
});
router.get("/choosetype", (req, res) => {
    res.render("choosetype");
});
router.route("/post")
    .get(homeController.renderPostForm)
    .post(homeController.savePost);
router.get("/secrets", homeController.renderSecrets);
router.post("/contactus", homeController.contactUs);
router.get("/custompathcreate", homeController.renderCustomPathForm);

module.exports = router;