const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  register: async (req, res) => {
    try {
      const isExisting = await User.findOne({ email: req.body.email });

      if (isExisting) {
        throw new Error("Already registered email");
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = await User.create({
        // email: req.body.email, user: req.body.username can also write as
        ...req.body,
        password: hashedPassword,
      });

      const {password,...others}= newUser._doc//_doc is used to get actual values
      // const { password, ...others } = newUser;
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });

      return res.status(201).json({ others, token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        throw new Error("Invalid User");
      }

      const comparePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!comparePassword) {
        throw new Error("Invalid Credentials");
      }

      const { password, ...others } = user._doc;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });

      return res.status(200).json({ others, token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};

module.exports = authController;
