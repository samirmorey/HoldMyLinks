const express = require("express");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const router = express.Router();

const Categorylink = require("../models/Categorylink");

// @desc Login/ Landing Page
// @route GET
router.get("/", ensureGuest, (req, res) => {
  res.render("login");
});
// @desc Dashboard Page
// @route GET
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const allCats = await Categorylink.find({ user: req.user.id }).lean();
    // console.log(req.user.createdAt)
    res.render("main", {
    	category: allCats,
    	userprof: req.user,
    	helper: require('../helpers/dateparse')
    });
  } catch (error) {
    res.render("error/500");
  }
});

module.exports = router;
