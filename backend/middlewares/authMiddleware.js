const {config} = require("dotenv");
const jwt = require("jsonwebtoken");

config();

exports.auth = (req, res, next) => {
  const key = process.env.SECRET_KEY;
  const token = req.headers.authorization.split('Bearer ')[1];
  try {
    jwt.verify(token, key, [], (err, decoded) => {
      if (decoded) {
        return next();
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
    return res.status(500).json({code: '500', message: error})
  }
}