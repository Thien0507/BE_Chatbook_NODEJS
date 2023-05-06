const express = require("express");
const { sendReact } = require("../controllers/reaction.controller");
const router = express.Router();
const { protect } = require("../controllers/auth.controller");

router.use(protect);
router.route("/sendreact").post(sendReact);

module.exports = router;
