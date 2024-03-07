import express from 'express'
const router = express.Router()
import homeController from "../controllers/home.js"
import authController from "../controllers/auth.js"
import postsController from "../controllers/posts.js"
import authenticate from "../middleware/auth.js"

// main routes
router.get("/", homeController.getIndex);
router.get("/profile", authenticate.ensureAuth, postsController.getProfile);
router.get("/feed", authenticate.ensureAuth, postsController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.post("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);


export default router