const express = require("express");
const router = express.Router();
const queries = require("../db/queries");

router.post("/", (req, res) => {
  const { responsable, responseTo } = req.body;
  queries
    .addWorkFlow(responsable, responseTo)
    .then(() => {
      queries
        .getUser(responseTo)
        .then((user) => {
          res.json(user);
        })
        .catch((err) => res.json({ err }));
    })
    .catch((err) => {
      if (err.code === "ER_DUP_ENTRY") {
        res.json({ err: "WORKFLOW_EXIST" });
      } else res.json({ err });
    });
});

router.delete("/", (req, res) => {
  const { responsable, responseTo } = req.query;
  queries
    .deleteWorkFlow(responsable, responseTo)
    .then((deleted) => {
      res.json(deleted);
    })
    .catch((err) => res.json({ err }));
});

router.get("/employees/all", (req, res) => {
  queries
    .getAllEmployees()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => res.json({ err }));
});

router.get("/responsables/all", (req, res) => {
  queries
    .getAllResponsables()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => res.json({ err }));
});

module.exports = router;
