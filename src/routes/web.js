import express from "express";
import homePageController from "../controllers/homePageController";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";
import landingPageController from "../controllers/landingPageController";
import activeController from "../controllers/activeController";
import editProfileController from "../controllers/editProfileController";
import applyController from "../controllers/applyController";
import auth from "../validation/authValidation";
import passport from "passport";
import initPassportLocal from "../controllers/passportLocalController";

// Init all passport
initPassportLocal();

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/login", loginController.getPageLogin);
    router.get(
        "/",
        loginController.checkLoggedIn,
        homePageController.handleHelloWorld
    );
    router.get(
        "/landingPage",
        loginController.checkLoggedOut,
        landingPageController.landingPage
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
    router.get("/active", activeController.activeSessions);
    router.get(
        "/active",
        loginController.checkLoggedIn,
        activeController.activeSessions
    );

    router.get("/apply", applyController.apply);

    router.get(
        "/editProfile",
        loginController.checkLoggedIn,
        editProfileController.editProfile
    );
    router.post("/editProfile", editProfileController.editProfileUser);

    router.get("/register", registerController.getPageRegister);
    router.post(
        "/register",
        auth.validateRegister,
        registerController.createNewUser
    );
    // post request for uploading image at home page
    // router.post(
    //     "/",
    //     loginController.checkLoggedIn,
    //     homePageController.uploadImage
    // );
    router.get("/logout", loginController.postLogOut);
    router.post("/logout", loginController.postLogOut);
    return app.use("/", router);
};
module.exports = initWebRoutes;