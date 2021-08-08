const express = require("express");

const postController = require("../controllers/post");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// must begin with /api/posts

router.get("", postController.getPosts);

router.get("/:postId", postController.getPost);

router.post("", isAuth, postController.createPost);

router.delete("/:postId", isAuth, postController.deletePost);

router.put("/:postId", isAuth, postController.updatePost);

module.exports = router;
