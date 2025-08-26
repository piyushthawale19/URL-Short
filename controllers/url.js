const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handlegenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "URL is required" });

  const shortID = nanoid(8);
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  // ✅ redirect back to "/" with query param instead of rendering directly
  return res.redirect("/?id=" + shortID);
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  if (!result) return res.status(404).json({ error: "Short URL not found" });

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handlegenerateNewShortURL,
  handleGetAnalytics,
};
