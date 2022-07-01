const express = require("express");
const { signup, login, getUserData} = require("../controllers/userController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user/:name", getUserData);

module.exports = router;
