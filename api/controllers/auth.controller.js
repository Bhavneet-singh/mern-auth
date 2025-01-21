import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
const signup = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();

    res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({
      email,
    });
    if (!validUser) return next(errorHandler(404, "User Not Found!!"));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid Credentials"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    //Remove password from the user object
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expiryDate,
      }) // 7 days in milliseconds
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export default {
  signup,
  signin,
};
