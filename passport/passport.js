const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName || profile.displayName ,
          lastName: profile.name.familyName || profile.displayName ,
          image: profile.photos[0].value,
          email: profile.emails[0].value,
        };
        try {
          const user = await User.findOne({
            googleId: profile.id,
          });
          if (user) {
            done(null, user);
          } else {
            const nuser = await User.create(newUser);
            done(null, nuser);
          }
        } catch (e) {
          console.error(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
