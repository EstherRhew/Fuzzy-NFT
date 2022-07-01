const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existName = await User.findOne({name});

    if (existName) {
      return res.status(400).json({ message: "Username already exist"})
    }

    // 1. 가입된 유저인지 여부를 확인
    const existEmail = await User.findOne({ email });

    if (existEmail) {
      return res.status(400).json({ message: "User already exist" });
    }

    // 2. 비밀번호 암호화
    const salt = await bcrypt.genSalt(10);
    const encrypedPassword = await bcrypt.hash(password, salt);

    // 3. 회원 정보 저장
    await new User({
      name,
      email,
      password: encrypedPassword,
    }).save();

    return res.status(201).json({
      message: "회원가입 완료",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;

    // 1. 유저 있는지 확인
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(400).json({ message: "Invalid user name credentials" });
    }

    // 2. 비밀번호 일치 여부 확인
    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      return res.status(400).json({ message: "Invalid user password credentials" });
    }

    // 3. 토큰 생성
    const payload = { _id: user._id};

    const token = jwt.sign(payload, "secret", { expiresIn: "1d" });

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const name = req.params.name
    const userData = await User.findOne({name})
    return res.status(200).json({ userData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}