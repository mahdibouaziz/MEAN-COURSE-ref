const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const { syncError, asyncError } = require("../errors/errors");
const User = require("../models/user");

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  return res.status(200).json({ messsage: "ok" });
};

exports.signup = async (req, res, next) => {
  /*
    1- check if the email and the passwords are valid
    2- Verif the email does not exist in the database
    3- hash the password
    4- store the user in the database
  */

  // step1
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // step2
  const email = req.body.email;
  const password = req.body.password;
  try {
    const userWithEmail = await User.findOne({ email }).exec();
    if (userWithEmail) {
      syncError("Email already exists", 422);
    }

    // step3
    const hashedPassword = await bcrypt.hash(password, 10);

    // step4
    const user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();

    return res.status(200).json({ messsage: "User created", userId: user._id });
  } catch (err) {
    asyncError(err, next);
  }
};
