const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {getAllComments,getCommentById,createComment,updateComment,deleteComment,likeComment} = require("../controllers/commentController");

const commentRouter = express.Router();


commentRouter.get('/:postId', getAllComments);
commentRouter.get('/find/:commentId', getCommentById);
commentRouter.post('/createComment', verifyToken,createComment);
commentRouter.put('/:commentId', verifyToken, updateComment);
commentRouter.delete('/:commentId', verifyToken, deleteComment);
commentRouter.put('/toggleLike/:commentId', verifyToken,likeComment);

module.exports = commentRouter;
