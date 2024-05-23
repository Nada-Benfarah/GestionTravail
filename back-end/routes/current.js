const express = require("express");
const router = express.Router();
const queries = require("../db/queries");

router.get("/", (req, res) => {
  const user = req.body.payload.user;
  queries
    .authentication(user.login, user.password)
    .then((user) => {
      if (user) {
        res.json(user);
      } else res.json({ err: "USER_NOT_EXIST" });
    })
    .catch((err) => {
      res.json({ err });
    });
});

module.exports = router;
