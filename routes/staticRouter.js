const express = require("express");
const router = express.Router();
const URL = require("../models/url"); // adjust path if needed

// Home page route
router.get("/", async (req, res) => {
  const allurls = await URL.find({});
  return res.render("home", {
    urls: allurls,
    host: req.get("host"),
    protocol: req.protocol,
    id: req.query.id
  });
});

module.exports = router;
