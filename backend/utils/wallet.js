const caver = require('../config/caver')

module.exports.validateSignedMessage = async (message, signedMessage, address) => {
  const v = '0x' + signedMessage.substring(2).substring(128, 130);
  const r = '0x' + signedMessage.substring(2).substring(0, 64);
  const s = '0x' + signedMessage.substring(2).substring(64, 128);
  return await caver.validator.validateSignedMessage(
    message,
    [v, r, s],
    address
  );
}