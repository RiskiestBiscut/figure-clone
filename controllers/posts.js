import cloudinary from "../middleware/cloudinary.js"
import Post from "../models/Post.js"

export default {
    getProfile: async (req, res) => {
        try {
          const posts = await Post.find({ user: req.user.id });
          res.render("profile.ejs", { posts: posts, user: req.user });
        } catch (err) {
          console.log(err);
        }
      },
    getFeed: async (req, res) => {
        try {
            const posts = await Post.find().sort({ createdAt: "desc" }).lean();
            res.render("feed.ejs", { posts: posts });
        } catch (err) {
            console.log(err)
        }
    },
    createPost: async (req, res) => {
        try {
          // Upload image to cloudinary
          const result = await cloudinary.uploader.upload(req.file.path);
    
          await Post.create({
            title: req.body.title,
            image: result.secure_url,
            cloudinaryId: result.public_id,
            caption: req.body.caption,
            likes: 0,
            user: req.user.id,
          });
          console.log("Post has been added!");
          res.redirect("/profile");
        } catch (err) {
          console.log(err);
        }
      },
}