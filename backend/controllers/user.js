const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { syncError, asyncError } = require("../errors/errors");
const User = require("../models/user");

exports.login = async (req, res, next) => {
  /*
    1- check if the email and the passwords are valid
    2- Get the user from the Database based on the email and check if the user exists
    3- Compare the 2 passwords if they're not valid return an error
    4- return a token
  */
  try {
    // step1
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      syncError("Invalid credentials", 422);
    }

    const email = req.body.email;
    const password = req.body.password;

    // step2
    const user = await User.findOne({ email }).exec();
    if (!user) {
      syncError("Invalid email", 422);
    }

    // step3
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      syncError("Invalid Password", 422);
    }

    //step4

    const token = await jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "thisisthebestsecreteverever",
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ token, userId: user._id.toString() });
  } catch (err) {
    asyncError(err, next);
  }
};

exports.signup = async (req, res, next) => {
  /*
    1- check if the email and the passwords are valid
    2- Verif the email does not exist in the database
    3- hash the password
    4- store the user in the database
  */

  try {
    // step1
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      syncError("Invalid credentials", 422);
    }
    // step2
    const email = req.body.email;
    const password = req.body.password;

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

    return res
      .status(200)
      .json({ messsage: "User created", userId: user._id.toString() });
  } catch (err) {
    asyncError(err, next);
  }
};
