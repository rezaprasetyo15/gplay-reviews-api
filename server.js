const express = require("express");
const gplay   = require("google-play-scraper");

const app  = express();
const PORT = process.env.PORT || 3000;

// GET /reviews?appId=com.gojek.gopay&country=id&num=100
app.get("/reviews", async (req, res) => {
  const { appId, country = "id", lang = "id", num = 100 } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const { data } = await gplay.reviews({
      appId,
      country,
      lang,
      num: parseInt(num),
      sort: gplay.sort.NEWEST,
    });

    const reviews = data.map(r => ({
      source:    "google_play",
      rating:    r.score,
      date:      r.date,
      title:     r.title ?? "",
      text:      r.text ?? "",
      thumbs_up: r.thumbsUpCount ?? 0,
    }));

    return res.json({ appId, total: reviews.length, reviews });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
