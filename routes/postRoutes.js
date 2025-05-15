const express = require("express");
// const mongoose = require('mongoose')
const verifyToken = require("../middlewares/verifyToken");
const {getUserPost,getAllPost,getPostById,createPost,updatePost,deletePost,likePost} = require("../controllers/postController");

const postRouter = express.Router();

postRouter.get('/find/userposts/:id',getUserPost);
postRouter.get('/timeline/posts', verifyToken,getAllPost);
postRouter.get('/find/:id',getPostById);
postRouter.post('/createPost', verifyToken,createPost);
postRouter.put('/:id', verifyToken,updatePost);
postRouter.delete('/:id', verifyToken,deletePost);
postRouter.put('/toggleLike/:id', verifyToken,likePost);

module.exports= postRouter;