const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

const urlRouter = require("./routes/urlRouter");
const staticRoute = require("./routes/staticRouter");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");

dotenv.config(); // ✅ Load .env file

const app = express();
const PORT = process.env.PORT || 8001;

// ✅ Connect to MongoDB
connectToMongoDB(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", staticRoute);
app.use("/url", urlRouter);

// ✅ Redirect handler
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );

  if (!entry) return res.status(404).send("URL not found");

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
