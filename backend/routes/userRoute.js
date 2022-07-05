const express = require("express");
const { signup, login, getUserData, addWalletAddress, deleteWalletAddress, verifyToken,getUserIdByAddress, getUserIdByName,getUserIdByInfo
} = require("../controllers/userController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/addWalletAddress", addWalletAddress)
router.post("/deleteWalletAddress", deleteWalletAddress)
router.get("/user/:userId", getUserData)
router.get("/userIdByName/:name", getUserIdByName);
router.get("/userIdByAddress/:address", getUserIdByAddress);
router.get("/verifyToken/:token", verifyToken)


module.exports = router;
