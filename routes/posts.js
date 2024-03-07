import express from "express"
const router = express.Router();
import upload from "../middleware/multer.js"
import postsController from "../controllers/posts.js"
import authenticate from "../middleware/auth.js"

//Post Routes - simplified for now
// router.get("/:id", ensureAuth, postsController.getPost);

router.post("/createPost", upload.single("file"), postsController.createPost);

// router.put("/likePost/:id", postsController.likePost);

// router.delete("/deletePost/:id", postsController.deletePost);

export default router