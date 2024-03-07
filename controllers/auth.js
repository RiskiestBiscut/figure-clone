import passport from "passport"
import validator from "validator"
import User from "../models/User.js"

export default {
    getLogin: (req, res) => {
    if (req.user) {
      return res.redirect("/profile");
    }
    res.render("login", {
      title: "Login",
    });
  },
    getSignup: (req, res) => {
    if (req.user) {
      return res.redirect("/profile");
    }
    res.render("signup", {
      title: "Create Account",
    });
  },
    postLogin: (req, res, next) => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.email))
      validationErrors.push({ msg: "Please enter a valid email address." });
    if (validator.isEmpty(req.body.password))
      validationErrors.push({ msg: "Password cannot be blank." });
  
    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("/login");
    }
    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });
  
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("errors", info);
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", { msg: "Success! You are logged in." });
        res.redirect(req.session.returnTo || "/profile");
      });
    })(req, res, next);
  },
    postSignup: async (req, res, next) => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.email))
      validationErrors.push({ msg: "Please enter a valid email address." });
    if (!validator.isLength(req.body.password, { min: 8 }))
      validationErrors.push({
        msg: "Password must be at least 8 characters long",
      });
    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      console.log(validationErrors)
      return res.redirect("../signup");
    }
    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });
  
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      country: req.body.country
    })

    try {
        const existingUser = await User.findOne({
            email: req.body.email 
        });
      
        if (existingUser) {
          req.flash("errors", {
            msg: "Account with that email address already exists.",
          });
          return res.redirect("../signup");
        }
      
        await user.save();

        console.log('req.user before login:', req.user);
        
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/profile");
        });
      } catch (err) {
        return next(err);
      }
    },
    logout: (req, res, next) => {
      req.logout((err) => {
        if (err) {
          // Handle the error
          console.error('Error during logout:', err);
          return next(err);  // Assuming 'next' is available in the current scope
        }
        console.log('User has logged out.')
        req.session.destroy((err) => {
          console.log("here")
          if (err)
            console.log("Error : Failed to destroy the session during logout.", err);
          req.user = null;
          res.redirect("/");
        });
      })
     
    },
}
