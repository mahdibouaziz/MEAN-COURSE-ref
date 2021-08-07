const express = require("express");

const postController = require("../controllers/post");

const router = express.Router();

// must begin with /api/posts

router.get("", postController.getPosts);

router.get("/:postId", postController.getPost);

router.post("", postController.createPost);

router.delete("/:postId", postController.deletePost);

router.put("/:postId", postController.updatePost);

module.exports = router;
