const express = require("express");
const router = express.Router();
const user = require("../models/user");

router.post("/login", async (req, res, next) => {
  try {
    // take the users email and password and attempt to authenticate them
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    // take the users email and password and create a new user in our database
  } catch (err) {
    next(err);
  }
});

module.exports = router;
