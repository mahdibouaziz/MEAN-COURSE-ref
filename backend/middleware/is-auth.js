const { syncEroor, syncError } = require("../errors/errors");
const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  /*
    1- verify that the Authorization exists in the request
    1- get the token from the Authorization
    2- verify and decode the token
    3- added the userId to the request
  */

  // step1
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    syncError("Not authorized", 401);
  }

  // step2
  const token = authHeader.split(" ")[1]; // because the token begin with Bearer

  // step3
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    syncError("Not authorized", 401);
  }

  // step4
  req.userId = decodedToken.userId;
  next();
};

module.exports = isAuth;
