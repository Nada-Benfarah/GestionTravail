const express = require("express");
const router = express.Router();
const queries = require("../db/queries");
const jwt = require("jsonwebtoken");

router.put("/:id", (req, res) => {
  const user = req.body.user;
  const id = req.params.id;
  queries
    .updateUser(id, user)
    .then((update) => {
      queries
        .getUser(id)
        .then((user) => {
          if (user) {
            const token = jwt.sign({ user }, process.env.TOKEN_SECRET);
            res.json({
              token: token,
              user: user,
            });
          } else res.json({ err: "USER_NOT_EXIST" });
        })
        .catch((err) => res.json({ err }));
    })
    .catch((err) => {
      if (err.code === "ER_DUP_ENTRY") {
        res.json({ err: "USERNAME_EXIST" });
      } else res.json({ err });
    });
});

module.exports = router;
