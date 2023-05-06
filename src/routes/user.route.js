const express = require("express");
const {
  signup,
  login,
  logout,
  protect,
} = require("../controllers/auth.controller");
const {
  updateMe,
  deleteMe,
  restoreMe,
  findUser,
  findAllUsers,
} = require("../controllers/user.controller");
const router = express.Router();

router.route("/auth/signup").post(signup);
router.route("/auth/login").post(login);
router.route("/auth/logout").get(logout);

router.use(protect);
router.route("/all").get(findAllUsers);
router.route("/:id").get(findUser);
router.route("").get(findUser); // find me
router.route("/updateMe/:id").post(updateMe);
router.route("/deleteMe/:id").delete(deleteMe);
router.route("/restoreMe/:id").get(restoreMe);

module.exports = router;
