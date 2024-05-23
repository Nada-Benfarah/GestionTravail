const express = require("express");
const router = express.Router();
const queries = require("../db/queries");

router.post("/", (req, res) => {
  const user = req.body.user;
  queries
    .addUser(user)
    .then((ids) => {
      id = ids[0];
      queries
        .getUser(id)
        .then((addedUser) => {
          res.json(addedUser);
        })
        .catch((err) => res.json({ err }));
    })
    .catch((err) => {
      if (err.code === "ER_DUP_ENTRY") {
        res.json({ err: "USERNAME_EXIST" });
      } else res.json({ err });
    });
});

router.put("/:id", (req, res) => {
  const user = req.body.user;
  const id = req.params.id;
  queries
    .updateUser(id, user)
    .then((update) => {
      queries
        .getUser(id)
        .then((user) => {
          res.json(user);
        })
        .catch((err) => res.json({ err }));
    })
    .catch((err) => {
      if (err.code === "ER_DUP_ENTRY") {
        res.json({ err: "USERNAME_EXIST" });
      } else res.json({ err });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  queries
    .deleteUser(id)
    .then((del) => {
      res.json(del);
    })
    .catch((err) => res.json({ err }));
});

router.get("/", (req, res) => {
  const id = req.query.id;
  queries
    .getUser(id)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => res.json({ err }));
});

router.get("/all", (req, res) => {
  queries
    .getAllUsers()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => res.json({ err }));
});

module.exports = router;
