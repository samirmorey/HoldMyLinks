const express = require("express");
const passport = require("passport");

const router = express.Router();

// @desc Auth With Google
// @route GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["email","profile"] }));

// @desc Google AUth Callback
// @route GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @desc Google AUth Logout
// @route GET /auth/logout
router.get("/logout", (req, res) => {
  req.session = null;
  // req.logout();
  res.redirect("/");
});


module.exports = router