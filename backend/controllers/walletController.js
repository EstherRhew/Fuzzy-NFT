const {validateSignedMessage} = require("../utils/wallet");
const User = require("../models/userModel");

exports.addWalletAddress = async (req, res) => {
  try {
    const {name, address, signature} = req.body;

    //이미 db에 있는 address인지 확인
    const exist =  await User.findOne({wallet_address: {$in: address}})

    if (exist) {
      return res.status(401).json({code: '401', message: `Address already registered`})
    }

    //signed message validate
    const isValidate = await validateSignedMessage(name, signature, address)

    if (!isValidate) {
      return res.status(402).json({code: '402', message: 'Message Validation failed'})
    }

    const user = await User.findOne({name});

    if (!user) {
      return res.status(403).json({code: '403', message: 'User does not exist'});
    }

    await User.findOneAndUpdate(
      {name},
      {$push: {wallet_address: [address]}}
    )

    return res.status(200).json({
      user
    })

  } catch (error) {
    return res.status(500).json({code: '500', message: error.message})
  }
}

exports.deleteWalletAddress = async (req, res) => {
  try {
    const {name, address, signature} = req.body;

    //signed message validate
    const isValidate = await validateSignedMessage(name, signature, address)

    if (!isValidate) {
      return res.status(402).json({code: '402', message: 'Message Validation failed'})
    }

    const user = await User.findOne({name});
    console.log(user, 'user')
    if (!user) {
      return res.status(403).json({code: '403', message: 'User does not exist'});
    }

    if (!user.wallet_address.includes(address)) {
      return res.status(404).json({code: '404', message: 'Wallet address does not exist'});
    }

    await User.findOneAndUpdate(
      {name},
      {$pull: {wallet_address: address}}
    )

    return res.status(200).json({
      user
    })

  } catch (error) {
    return res.status(500).json({code: '500', message: error.message})
  }
}

