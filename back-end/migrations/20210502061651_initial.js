exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("user_id").primary();
      table.string("fname");
      table.string("lname");
      table.string("email").unique();
      table.string("login").notNullable().unique();
      table.string("password").notNullable();
      table.enu("role", ["admin", "responsable", "user"]);
    })
    .then(() => {
      return knex.schema.createTable("workflow", (table) => {
        table
          .integer("responsable")
          .unsigned()
          .references("user_id")
          .inTable("users")
          .onDelete("CASCADE");
        table
          .integer("responseTo")
          .unsigned()
          .references("user_id")
          .inTable("users")
          .onDelete("CASCADE");
        table.primary(["responsable", "responseTo"]);
      });
    })
    .then(() => {
      return knex.schema.createTable("demandes", (table) => {
        table.increments("demande_id").primary();
        table
          .integer("from")
          .unsigned()
          .references("user_id")
          .inTable("users")
          .onDelete("CASCADE");
        table.enu("type", [
          "conge",
          "fiche_de_paie",
          "autorisation",
          "evaluation",
        ]);
        table.dateTime("start_date", { useTz: false });
        table.dateTime("end_date", { useTz: false });
        table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
      });
    })
    .then(() => {
      return knex.schema.createTable("reponses", (table) => {
        table.increments("reponse_id").primary();
        table
          .integer("from")
          .unsigned()
          .references("user_id")
          .inTable("users")
          .onDelete("CASCADE");
        table
          .integer("demande")
          .unsigned()
          .references("demande_id")
          .inTable("demandes")
          .onDelete("CASCADE");
        table.enu("response", ["accepted", "refused"]);
        table.integer("evaluation");
        table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("reponses")
    .then(() => {
      return knex.schema.dropTable("demandes");
    })
    .then(() => {
      return knex.schema.dropTable("workflow");
    })
    .then(() => {
      return knex.schema.dropTable("users");
    });
};
