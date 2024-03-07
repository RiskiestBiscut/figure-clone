import { Strategy as LocalStrategy } from "passport-local";
import mongoose from "mongoose";
import User from "../models/User.js";

export default function configurePassport(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        console.log(user)

        if (!user) {
          return done(null, false, { msg: `Email ${email} not found.` });
        }

        if (!user.password) {
          return done(null, false, {
            msg:
              "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
          });
        }

        const isMatch = await user.comparePassword(password);

        if (isMatch) {
          return done(null, user);
        }

        return done(null, false, { msg: "Invalid email or password." });
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    console.log('serializeUser');
    console.log(user);
  
    try {
      if (!user.id) {
        console.error('User object is missing the "id" property:', user);
        throw new Error('User object is missing the "id" property');
      }
  
      done(null, user.id);
    } catch (err) {
      done(err);
    }
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
