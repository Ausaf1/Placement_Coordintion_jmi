import express from "express";
import homePageController from "../controllers/homePageController";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";
import landingPageController from "../controllers/landingPageController";
import activeController from "../controllers/activeController";
import editProfileController from "../controllers/editProfileController";
import applyController from "../controllers/applyController";
import roundsController from "../controllers/roundController";
import adminController from "../controllers/adminController";
import auth from "../validation/authValidation";
import passport from "passport";
import initPassportLocal from "../controllers/passportLocalController";

// Init all passport
initPassportLocal();

let router = express.Router();

let initWebRoutes = (app) => {
  //langing page route
  router.get(
    "/landingPage",
    loginController.checkLoggedOut,
    landingPageController.landingPage
  );

  //register page route
  router.get("/register", registerController.getPageRegister);
  router.post(
    "/register",
    auth.validateRegister,
    registerController.createNewUser
  );

  //login page route
  router.get("/login", loginController.getPageLogin);
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      successFlash: true,
      failureFlash: true,
    })
  );

  router.get("/admin-login", adminController.getPageAdminLogin);
  router.post(
    "/admin-login",
    passport.authenticate("local", {
      successRedirect: "/admin",
      failureRedirect: "/login",
      successFlash: true,
      failureFlash: true,
    })
  );

  // logout route
  router.get("/logout", loginController.postLogOut);
  router.post("/logout", loginController.postLogOut);

  //profile homepage route
  router.get(
    "/",
    loginController.checkLoggedIn,
    homePageController.handleHelloWorld
  );

  //edit profile page route
  router.get(
    "/editProfile",
    loginController.checkLoggedIn,
    editProfileController.editProfile
  );
  router.post("/editProfile/:id", editProfileController.editProfileUser);
  router.post("/:id", editProfileController.uploadImage);

  //router.get("/active", activeController.activeSessions);
  //active sessions page
  router.get(
    "/active",
    loginController.checkLoggedIn,
    activeController.activeSessions
  );

  // router.post("/active", activeController.checkApplied);

  //apply page route
  router.get("/apply/:id", applyController.apply);
  router.post("/apply/:id", applyController.applyJob);
  router.get("/thanks", (req, res) => {
    res.render("thanks.ejs");
  });

  //rounds page route
  router.get("/rounds/:id", roundsController.round);

  // admin page routes

  router.get("/admin", adminController.authenticate, adminController.getPage);
  //user table
  router.get("/update-user/:id", adminController.getEditUser);
  router.get("/delete-user/:id", adminController.deleteUser);
  //company table
  router.get("/update-company/:id", adminController.getEditCompany);
  router.post("/update-company/:id", adminController.updateCompany);
  router.get("/delete-company/:id", adminController.deleteCompany);
  //job table
  router.get("/update-job/:id", adminController.getEditJob);
  router.post("/update-job/:id", adminController.updateJob);
  router.get("/delete-job/:id", adminController.deleteJob);
  //applications table
  router.get("/accept-application/:id", adminController.acceptApplication);
  router.get("/reject-application/:id", adminController.rejectApplication);
  router.get("/reset-application/:id", adminController.resetApplication);
  router.get("/delete-application/:id", adminController.deleteApplication);

  return app.use("/", router);
};

module.exports = initWebRoutes;
