const express = require("express");
const {
  sendMessage,
  getMessage,
  getConversations,
} = require("../controllers/message.controller");
const router = express.Router();
const { protect } = require("../controllers/auth.controller");

router.use(protect);

router.route("/sendmsg").post(sendMessage);
router.route("").get(getMessage);
router.route("/conversations").get(getConversations);

module.exports = router;
