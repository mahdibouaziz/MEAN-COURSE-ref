const { syncError, asyncError } = require("../errors/errors");
const Post = require("../models/post");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}).exec();
    return res.status(200).json({
      message: "Post fetched succesfully",
      posts,
    });
  } catch (err) {
    asyncError(err, next);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if (!post) {
    syncError("Post does not exists", 404);
  }
  return res.status(200).json(post);
};

exports.createPost = async (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    await post.save();
    return res.status(201).json({ message: "Post created", postId: post._id });
  } catch (err) {
    asyncError(err, next);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    await Post.updateOne(
      { _id: req.params.postId },
      { title: req.body.title, content: req.body.content }
    );
    // console.log(post);
    res.status(200).json({ message: "Post Updated" });
  } catch (err) {
    asyncError(err, next);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    await Post.deleteOne({ _id: postId });
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    asyncError(err, next);
  }
};
