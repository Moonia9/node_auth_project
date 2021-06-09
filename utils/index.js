const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

//take an id, calculte and return a signed JWT
function generateJWT(userId) {
  const secret = process.env.JWT_SECRET;
  const jwt = jsonwebtoken.sign({ id: userId }, secret);
  return jwt;
}

module.exports = {
  generateJWT: generateJWT,
};

//console.log(module.exports);
