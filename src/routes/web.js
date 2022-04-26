import express from "express";
import homePageController from "../controllers/homePageController";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";
import landingPageController from "../controllers/landingPageController";
import activeController from "../controllers/activeController";
import editProfileController from "../controllers/editProfileController";
import applyController from "../controllers/applyController";
import roundsController from "../controllers/roundController";
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
    router.post("/login",
        passport.authenticate("local", {
            successRedirect: "/",
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
    router.post(
        "/editProfile", 
        editProfileController.editProfileUser);    
    router.post(
        "/",
        editProfileController.uploadImage
    );

    //router.get("/active", activeController.activeSessions);
    //active sessions page
    router.get(
        "/active",
        loginController.checkLoggedIn,
        activeController.activeSessions
    );

    router.post("/active", activeController.checkApplied);

    //apply page route
    router.get("/apply", applyController.apply);

    //rounds page route
    router.get("/rounds", roundsController.round);


    return app.use("/", router);
};

module.exports = initWebRoutes;