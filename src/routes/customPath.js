const router = require("express").Router();
const customPathController = require("../controllers/customPathController.js");

router.post("/", customPathController.createCustomPath);
router.get("/:path", customPathController.renderCustomPath);
router.post("/:path", customPathController.sendMessage);
router.get("/adm/:path", customPathController.renderAdmPage);

module.exports = router;