const express = require("express");
const router = express.Router();
const { protect } = require("../controllers/auth.controller");
const { findAllAction } = require("./../controllers/action.controller");

router.use(protect);
router.route("").get(findAllAction);

module.exports = router;
