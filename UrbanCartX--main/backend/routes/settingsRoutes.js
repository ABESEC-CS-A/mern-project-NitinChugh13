// routes/settingsRoutes.js
import express from "express";

let siteSettings = {
  siteName: "UrbanCartX",
  contactEmail: "support@urbancartx.com",
  supportPhone: "+91 9876543210",
};

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({ settings: siteSettings });
});

router.patch("/", (req, res) => {
  siteSettings = { ...siteSettings, ...req.body };
  return res.status(200).json({ settings: siteSettings });
});

export default router;