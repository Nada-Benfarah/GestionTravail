exports.up = function (knex) {
  return knex.schema.alterTable("reponses", (table) => {
    table.string("pdf_file");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("reponses", (table) => {
    table.dropColumn("pdf_file");
  });
};
