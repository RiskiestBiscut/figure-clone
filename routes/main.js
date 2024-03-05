import express from 'express'
const router = express.Router()
import homeController from "../controllers/home.js"
import authController from "../controllers/auth.js"

// main routes
router.get("/", homeController.getIndex);
router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

export default router