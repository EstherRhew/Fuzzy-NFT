const express = require("express");
const { signup, login, getUserData, addWalletAddress, deleteWalletAddress} = require("../controllers/userController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/addWalletAddress", addWalletAddress)
router.post("/deleteWalletAddress", deleteWalletAddress)
router.get("/user/:name", getUserData);


module.exports = router;
