const express = require("express");
const { sendInvitation, respond } = require("../controllers/friend.controller");
const router = express.Router();
const { protect } = require("../controllers/auth.controller");

router.use(protect);
router.route("/sendInvitation").post(sendInvitation);
router.route("/respond/:id").patch(respond);

module.exports = router;
