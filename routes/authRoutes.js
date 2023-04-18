const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verificationSignUp = require("../middlewares/verificationSignup");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verificationSignUp.checkDuplicateUsernameOrEmail,
      verificationSignUp.checkRolesExisted,
     
    ],
    authController.signup
  );

  app.post("/api/auth/signin", authController.signin);
};