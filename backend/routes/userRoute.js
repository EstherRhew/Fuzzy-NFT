const express = require("express");
const { signup, login, getUserData, verifyToken,getUserIdByAddress, getUserIdByName,getUserIdByInfo
} = require("../controllers/userController");
const {addWalletAddress, deleteWalletAddress} = require("../controllers/walletController");
const {auth} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/addWalletAddress", auth, addWalletAddress)
router.post("/deleteWalletAddress", auth, deleteWalletAddress)
router.get("/user/:userId", auth, getUserData)
router.get("/userIdByName/:name", auth, getUserIdByName);
router.get("/userIdByAddress/:address", auth, getUserIdByAddress);
router.get("/verifyToken/:token", verifyToken)


module.exports = router;
