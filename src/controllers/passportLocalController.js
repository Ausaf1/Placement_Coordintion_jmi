import passportLocal from "passport-local";
import passport from "passport";
import loginService from "../services/loginService";

let LocalStrategy = passportLocal.Strategy;

let initPassportLocal = () => {
  //console.log("In passportLocalController.js");
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          //console.log("entered email: ", email);
          //console.log("enter password: ", password);
          await loginService.findUserByEmail(email).then(async (user) => {
            if (!user) {
              return done(
                null,
                false,
                req.flash("errors", `This user email "${email}" doesn't exist`)
              );
            }
            if (user) {
              let match = await loginService.comparePassword(password, user);
              if (match === true) {
                //console.log("successful login");
                return done(null, user, null);
              } else {
                return done(null, false, req.flash("errors", match));
              }
            }
          });
        } catch (err) {
          console.log(err);
          return done(null, false, { message: err });
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {

  loginService
    .findUserById(id)
    .then((user) => {
      return done(null, user);
    })
    .catch((error) => {
      return done(error, null);
    });
});

module.exports = initPassportLocal;
