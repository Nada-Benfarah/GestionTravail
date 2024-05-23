const express = require("express");
const router = express.Router();
const queries = require("../db/queries");

router.post("/", (req, res) => {
  const demande = req.body.demande;
  queries
    .addDemande(demande)
    .then((ids) => {
      id = ids[0];
      queries
        .getDemande(id)
        .then((addedDemade) => {
          res.json(addedDemade);
        })
        .catch((err) => res.json({ err }));
    })
    .catch((err) => res.json({ err }));
});

router.get("/all", (req, res) => {
  const user_id = req.body.payload.user.user_id;
  queries
    .getAllDemandesByUser(user_id)
    .then((demandes) => {
      res.json(demandes);
    })
    .catch((err) => res.json({ err }));
});

module.exports = router;
