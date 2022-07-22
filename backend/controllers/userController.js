const {config} = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

config();
const key = process.env.SECRET_KEY;

exports.signup = async (req, res) => {
  try {
    const {name, email, password} = req.body;

    const existName = await User.findOne({name});

    if (existName) {
      return res.status(400).json({code: '400', message: "Username already exist"})
    }

    // 1. 가입된 유저인지 여부를 확인
    const existEmail = await User.findOne({email});

    if (existEmail) {
      return res.status(400).json({code: '400',message: "User already exist"});
    }

    // 2. 비밀번호 암호화
    const salt = await bcrypt.genSalt(10);
    const encrypedPassword = await bcrypt.hash(password, salt);

    // 3. 회원 정보 저장
    await new User({
      name,
      email,
      password: encrypedPassword,
    }).save((error, user) => {
      if (error) {
        return res.status(500).json({code: '500',message: error});
      }
      return res.status(201).json({user})      ;
    });

    // return res.status(201).json({
    //   message: "회원가입 완료",
    // });
  } catch (error) {
    return res.status(500).json({code: '500',message: error.message});
  }
};

exports.login = async (req, res) => {
  try {
    const {name, password} = req.body;

    // 1. 유저 있는지 확인
    const user = await User.findOne({name});

    if (!user) {
      return res.status(400).json({code: '400',message: "Invalid user name credentials"});
    }

    // 2. 비밀번호 일치 여부 확인
    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      return res.status(400).json({code: '400',message: "Invalid user password credentials"});
    }

    // 3. 토큰 생성
    const payload = {_id: user._id};

    const token = jwt.sign(payload, key, {expiresIn: "1d"});

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    return res.status(500).json({code: '500',message: error.message});
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const token  = req.params.token;
    jwt.verify(token, key, [], (err, decoded) => {
      if (decoded) {
        const now = new Date().getTime()

        if (decoded.exp * 1000 < now) {
          return res.status(500).json({code: '500',message: `token expired`});
        }

        return res.status(200).json({decoded});
        // return next();
      }

      console.log(err)
      if (err.name === "TokenExpiredError") {
        return res.status(411).json({code: '419', message: 'Token expired'})
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(410).json({code: '410', message: 'Invalid token'})
      }
    });



  } catch (error) {
    return res.status(500).json({code: '500', message: error.message});
  }
}

exports.getUserData = async (req, res) => {
  try {
    const userId = req.params.userId //either id, name, or address
    const userData = await User.findOne({_id: userId})
    return res.status(200).json({userData});
  } catch (error) {
    return res.status(500).json({code: '500', message: error.message});
  }
}

exports.getUserIdByName = async (req, res) => {
  try {
    const name = req.params.name
    const userData = await User.findOne({name})
    return res.status(200).json({userId: userData._id});
  } catch (error) {
    return res.status(500).json({code: '500', message: error.message});
  }
}

exports.getUserIdByAddress = async (req, res) => {
  try {
    const address = req.params.address
    const userData = await User.findOne({wallet_address: { $in: address}})
    return res.status(200).json({userId: userData._id});
  } catch (error) {
    return res.status(500).json({code: '500', message: error.message});
  }
}

exports.getUserIdByEmail = async (req, res) => {
  try {
    const email = req.params.email
    const userData = await User.findOne({email})
    return res.status(200).json({userId: userData._id});
  } catch (error) {
    return res.status(500).json({code: '500', message: error.message});
  }
}

exports.uploadProfileImage = async (req, res) => {
  try {
    const {user_id} = req.body
    const file  = req.file
    console.log(file, 222)
    const user = await User.findOneAndUpdate(
      { _id: user_id },
      { image: `http://localhost:5000/image/${file.filename}` });

    return res.status(200).json({user})

  } catch (error) {
    return res.status(500).json({code: '500', message: error.message});
  }
}