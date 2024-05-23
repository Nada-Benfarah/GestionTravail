const express = require("express");
const router = express.Router();

router.get("/pdf", function (req, res) {
  const pdfPath = req.query.pdfPath;
  const file = `${__dirname}/../${pdfPath}`;
  res.download(file);
});

module.exports = router;
