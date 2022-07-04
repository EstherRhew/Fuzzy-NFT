const Caver = require('caver-js')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const {validateSignedMessage} = require("../utils/wallet");

exports.signup = async (req, res) => {
  try {
    const {name, email, password} = req.body;

    const existName = await User.findOne({name});

    if (existName) {
      return res.status(400).json({message: "Username already exist"})
    }

    // 1. 가입된 유저인지 여부를 확인
    const existEmail = await User.findOne({email});

    if (existEmail) {
      return res.status(400).json({message: "User already exist"});
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
    return res.status(500).json({message: error.message});
  }
};

exports.login = async (req, res) => {
  try {
    const {name, password} = req.body;

    // 1. 유저 있는지 확인
    const user = await User.findOne({name});

    if (!user) {
      return res.status(400).json({message: "Invalid user name credentials"});
    }

    // 2. 비밀번호 일치 여부 확인
    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      return res.status(400).json({message: "Invalid user password credentials"});
    }

    // 3. 토큰 생성
    const payload = {_id: user._id};

    const token = jwt.sign(payload, "secret", {expiresIn: "1d"});

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
};

exports.addWalletAddress = async (req, res) => {
  try {
    const {name, address, signature} = req.body;
    //signed message validate
    const isValidate = await validateSignedMessage(name, signature, address)

    if (!isValidate) {
      return res.status(402).json({message: 'Message Validation failed'})
    }

    const user = await User.findOne({name});
    if (!user) {
      return res.status(403).json({message: 'User does not exist'});
    }

    if (user.wallet_address.includes(address)) {
      return res.status(404).json({message: 'Address already exist'});
    }

    await User.findOneAndUpdate(
      {name},
      {$push: {wallet_address: [address]}}
    )

    return res.status(200).json({
      user
    })

  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

exports.getUserData = async (req, res) => {
  try {
    const name = req.params.name
    const userData = await User.findOne({name})
    return res.status(200).json({userData});
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
}

// > caver.klay.sign('Message to sign', '0x1427ac5d0f1c3174ee6ea05d29a9b05fd31d7579').then(console.log)
// 0xde8bd2f5a45de6b1baea57ed0219735ab60f0ef55c5e31a4b774824abea31bfc34c8bdbca43ed4155e8e6a8e0d11d7aba191ba025e0487ada2bcc422252b81591b