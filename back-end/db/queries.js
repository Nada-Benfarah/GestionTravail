const knex = require("./knex");

module.exports = {
  authentication(login, password) {
    return knex("users")
      .where({ login, password })
      .orWhere({ email: login, password })
      .first();
  },
  addUser(user) {
    return knex("users").insert(user);
  },
  updateUser(id, user) {
    return knex("users").update(user).where({ user_id: id });
  },
  deleteUser(id) {
    return knex("users").where({ user_id: id }).del();
  },
  getAllUsers() {
    return knex("users").whereNot("role", "admin");
  },
  getAllEmployees() {
    return knex("users").where("role", "user");
  },
  getAllResponsables() {
    return knex({ r: "users" })
      .select({
        resp_id: "r.user_id",
        resp_fname: "r.fname",
        resp_lname: "r.lname",
        resp_login: "r.login",
        resp_role: "r.role",
        emp_id: "e.user_id",
        emp_fname: "e.fname",
        emp_lname: "e.lname",
        emp_login: "e.login",
        emp_role: "e.role",
      })
      .leftJoin(knex("workflow").as("w"), "r.user_id", "w.responsable")
      .leftJoin(knex("users").as("e"), "w.responseTo", "e.user_id")
      .where("r.role", "=", "responsable");
  },
  getUser(id) {
    return knex("users").where({ user_id: id }).first();
  },
  addDemande(demande) {
    return knex("demandes").insert(demande);
  },
  getDemande(id) {
    return knex("demandes").where({ demande_id: id }).first();
  },
  getAllDemandes() {
    return knex({ d: "demandes" })
      .select([
        "d.*",
        "u.*",
        "rb.user_id as rb_id",
        "rb.fname as rb_fname",
        "rb.lname as rb_lname",
        "rb.login as rb_login",
        "rb.role as rb_role",
        "r.reponse_id",
        "r.response",
        "r.evaluation",
        "r.pdf_file",
      ])
      .innerJoin(knex("users").as("u"), "u.user_id", "d.from")
      .leftJoin(knex("reponses").as("r"), "r.demande", "d.demande_id")
      .leftJoin(knex("users").as("rb"), "rb.user_id", "r.from")
      .orderBy("d.created_at", "desc");
  },
  getAllDemandesByUser(user_id) {
    return knex({ d: "demandes" })
      .select([
        "d.*",
        "rb.user_id as rb_id",
        "rb.fname as rb_fname",
        "rb.lname as rb_lname",
        "rb.login as rb_login",
        "rb.role as rb_role",
        "r.reponse_id",
        "r.response",
        "r.evaluation",
        "r.pdf_file",
      ])
      .leftJoin(knex("reponses").as("r"), "r.demande", "d.demande_id")
      .leftJoin(knex("users").as("rb"), "rb.user_id", "r.from")
      .where("d.from", "=", user_id)
      .orderBy("d.created_at", "desc");
  },
  getAllDemandesByResponsable(resp_id) {
    return knex({ d: "demandes" })
      .select([
        "d.*",
        "u.*",
        "rb.user_id as rb_id",
        "rb.fname as rb_fname",
        "rb.lname as rb_lname",
        "rb.login as rb_login",
        "rb.role as rb_role",
        "r.reponse_id",
        "r.response",
        "r.evaluation",
        "r.pdf_file",
      ])
      .innerJoin(
        knex("workflow").where({ responsable: resp_id }).as("w"),
        "w.responseTo",
        "d.from"
      )
      .innerJoin(knex("users").as("u"), "u.user_id", "d.from")
      .leftJoin(knex("reponses ").as("r"), "r.demande", "d.demande_id")
      .leftJoin(knex("users").as("rb"), "rb.user_id", "r.from")
      .orderBy("d.created_at", "desc");
  },
  addReponse(reponse) {
    return knex("reponses").insert(reponse);
  },
  updateReponse(reponse_id, reponse) {
    return knex("reponses").update(reponse).where({ reponse_id });
  },
  getAllReponses(user_id) {
    return knex({ r: "reponses" })
      .select(["r.*", "d.demande_id", "d.type", "d.start_date", "d.end_date"])
      .innerJoin(
        knex("demandes").where({ from: user_id }).as("d"),
        "r.demande",
        "d.demande_id"
      );
  },
  getReponse(reponse_id) {
    return knex("reponses").where("reponse_id", reponse_id).first();
  },
  addWorkFlow(responsable, responseTo) {
    return knex("workflow").insert({ responsable, responseTo });
  },
  deleteWorkFlow(responsable, responseTo) {
    return knex("workflow").where({ responsable, responseTo }).del();
  },
};
