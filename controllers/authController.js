const { User } = require("../models/User.model");
const { Role } = require("../models/role.model");
const { secret} = require("../config/auth.config")
const asyncHandler = require('express-async-handler')

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

const signup = asyncHandler(async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    await user.save();

    if (req.body.roles) {
      const roles = await Role.find({ name: { $in: req.body.roles } });
      if (!roles) {
        res.status(500).send({ message: err });
        return;
      }

      user.roles = roles.map((role) => role._id);

      try {
        await user.save();
        res.send({ message: "User was registered successfully!" });
      } catch (error) {
        res.status(500).send({ message: error });
        return;
      }
    } else {
      const role = await Role.findOne({ name: "user" });

      if (!role) {
        res.status(500).send({ message: err });
        return;
      }

      user.roles = [role._id];
      try {
        await user.save();
        res.send({ message: "User was registered successfully!" });
      } catch (error) {
        res.status(500).send({ message: error });
        return;
      }
    }
  } catch (error) {
    res.status(500).send({ message: error });
    return;
  }
});

const signin = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    })
      .populate("roles", "-__v")
      .exec();

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, secret, {
      expiresIn: 86400, // 24 hours
    });

    const authorities = [];

    for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({ message: error });
    return;
  }
});

module.exports = {
    signup,
    signin
}