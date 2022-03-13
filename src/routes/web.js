import express from "express";
import homePageController from "../controllers/homePageController";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";
import landingPageController from "../controllers/landingPageController";
import activeController from "../controllers/activeController";
import editProfileController from "../controllers/editProfileController";
import auth from "../validation/authValidation";
import passport from "passport";
import initPassportLocal from "../controllers/passportLocalController";

// Init all passport
initPassportLocal();

let router = express.Router();

let initWebRoutes = (app) => {
    router.get(
        "/",
        loginController.checkLoggedIn,
        homePageController.handleHelloWorld
    );
    router.get("/landingPage", landingPageController.landingPage);
    router.get(
        "/login",
        loginController.checkLoggedOut,
        loginController.getPageLogin
    );
    router.post(
        "/login",
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/login",
            successFlash: true,
            failureFlash: true,
        })
    );
    router.post(
        "/active",
        loginController.checkLoggedIn,
        activeController.activeSessions
    );

    router.post("/editProfile", editProfileController.editProfile);

    router.get("/register", registerController.getPageRegister);
    router.post(
        "/register",
        auth.validateRegister,
        registerController.createNewUser
    );
    router.post("/logout", loginController.postLogOut);
    return app.use("/", router);
};
module.exports = initWebRoutes;