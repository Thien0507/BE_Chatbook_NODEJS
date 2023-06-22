const express = require("express");
const {
  sendInvitation,
  respond,
  getAllFriendMe,
  deleteFriend,
  getMutalFriend,
  checkFriendship,
} = require("../controllers/friend.controller");
const router = express.Router();
const { protect } = require("../controllers/auth.controller");

router.use(protect);
router.route("/sendInvitation").post(sendInvitation);
router.route("/respond/:id").patch(respond);
router.route("").get(getAllFriendMe);
router.route("/:id").get(getAllFriendMe);
router.route("/mutal/:id").get(getMutalFriend);
router.route("/delete/:id").delete(deleteFriend);
router.route("/check/:id").get(checkFriendship);

module.exports = router;
