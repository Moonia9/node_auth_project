const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

//take an id, calculte and return a signed JWT
function generateJWT(userId) {
  const secret = process.env.JWT_SECRET;
  const jwt = jsonwebtoken.sign({ id: userId }, secret, { expiresIn: "1h" });
  return jwt;
}

//"reverse it"
//take a jwt string, verufy the signature matches (nased on your secret)
//ig it matches, return the userId, otherwise return false
function decodeJWT(jwt) {
  const secret = process.env.JWT_SECRET;
  try {
    const data = jsonwebtoken.verify(jwt, secret);
    return data.id;
  } catch (e) {
    return false;
  }
}

module.exports = {
  generateJWT: generateJWT,
  decodeJWT: decodeJWT,
};

//console.log(module.exports);
