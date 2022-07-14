const express = require("express");
const { signup, login, getUserData, verifyToken,getUserIdByAddress, getUserIdByName, uploadProfileImage
} = require("../controllers/userController");
const {addWalletAddress, deleteWalletAddress} = require("../controllers/walletController");
const {auth} = require("../middlewares/authMiddleware");
const {uploadFile} = require("../middlewares/fileControlMiddleware");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/addWalletAddress", auth, addWalletAddress)
router.post("/deleteWalletAddress", auth, deleteWalletAddress)
router.get("/user/:userId", getUserData)
router.get("/userIdByName/:name", getUserIdByName);
router.get("/userIdByAddress/:address", getUserIdByAddress);
router.get("/verifyToken/:token", verifyToken)
router.put("/uploadProfileImage", uploadFile.single("profile_img"), uploadProfileImage)


module.exports = router;
