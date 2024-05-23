const jwt = require("jsonwebtoken");

module.exports = {
  verifyUserToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401); // if there isn't any token

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.body["payload"] = user;
      next(); // pass the execution off to whatever request the client intended
    });
  },

  verifyResponsableToken(req, res, next) {
    if (req.body.payload.role === "user") return res.sendStatus(401);
    next();
  },
  verifyAdminToken(req, res, next) {
    if (
      req.body.payload.role === "user" ||
      req.body.payload.role === "responsable"
    )
      return res.sendStatus(401);
    next();
  },
};
