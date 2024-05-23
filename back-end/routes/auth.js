const express = require("express");
const router = express.Router();
const queries = require("../db/queries");
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
  const { login, password } = req.body;
  queries
    .authentication(login, password)
    .then((user) => {
      if (user) {
        const token = jwt.sign({ user }, process.env.TOKEN_SECRET);
        res.json({
          token: token,
          user: user,
        });
      } else res.json({ err: "USER_NOT_EXIST" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ err });
    });
});

module.exports = router;
