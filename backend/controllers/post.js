const { syncError, asyncError } = require("../errors/errors");
const Post = require("../models/post");

exports.getPosts = async (req, res, next) => {
  try {
    // for the pagnation we need: currentPage, postsPerPage, totalPosts, totalPages
    const currentPage = +req.query.page || 0;
    const postsPerPage = +req.query.postsPerPage || 3;
    const totalPosts = await Post.find().countDocuments();
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    const posts = await Post.find()
      .skip(currentPage * postsPerPage)
      .limit(postsPerPage);

    return res.status(200).json({
      totalPages,
      totalPosts,
      currentPage,
      posts,
    });

    // const posts = await Post.find({}).exec();
    // return res.status(200).json({
    //   message: "Post fetched succesfully",
    //   posts,
    // });
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
  // console.log(req.file); // our image is here
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
  });

  try {
    await post.save();
    return res.status(201).json({
      message: "Post created",
      post: {
        id: post._id,
        content: post.content,
        title: post.title,
        imagePath: post.imagePath,
      },
    });
  } catch (err) {
    asyncError(err, next);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    // console.log(req.file);
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = await Post.updateOne(
      { _id: req.params.postId },
      { title: req.body.title, content: req.body.content, imagePath }
    );
    // console.log(post);
    res.status(200).json({ message: "Post Updated", post });
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
