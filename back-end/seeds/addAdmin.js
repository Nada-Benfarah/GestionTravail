exports.seed = function (knex) {
  // Deletes ALL existing entries
  knex("users")
    .where({ role: "Admin" })
    .first()
    .then((admin) => {
      if (admin) return Promise.resolve();

      return knex("users")
        .del()
        .then(function () {
          // Inserts seed entries
          return knex("users").insert([
            {
              login: "admin",
              password:
                "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", // 123456
              fname: "admin",
              lname: "admin",
              role: "Admin",
            },
          ]);
        });
    });
};
