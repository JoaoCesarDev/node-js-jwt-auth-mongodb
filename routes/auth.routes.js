const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const controller_role = require("../controllers/role.controller")

module.exports = function(app) {

app.use(function(req, res,next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
      next();
});
  app.post("/api/auth/signup",[verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.CheckRolesExisted],controller.signup);

  app.post("/api/auth/signin", controller.signin);
  app.get("/api/auth/all_users",controller.allUsers);
  app.get("/api/auth/:id",controller.findOne);
  app.put("/api/auth/:id",controller.update);
  app.post("/api/auth/roles",controller_role.allRoles);
  app.delete("/api/auth/:id",controller.deleteUser);
};