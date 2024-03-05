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
      
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/profile");
        });
      } catch (err) {
        return next(err);
      }
    }
}
