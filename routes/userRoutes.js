const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
  suggestedUsers,
  findFriends,
  findUserId,
  getAllUsers,
  updateUser,
  followUnfollow,
  deleteUser,
  bookmarkPost
} = require("../controllers/userController");
const userRouter = express.Router();

userRouter.get("/find/suggestedUsers", verifyToken, suggestedUsers);
userRouter.get("/find/friends", verifyToken, findFriends);
userRouter.get("/find/:userId", verifyToken, findUserId);
userRouter.get("/findAll", getAllUsers);
userRouter.put("/updateUser/:userId", verifyToken, updateUser);

userRouter.delete("/deleteUser/:userId", verifyToken, deleteUser);
userRouter.put("/toggleFollow/:otherUserId", verifyToken, followUnfollow);
userRouter.put("/bookmark/:postId", verifyToken, bookmarkPost);


module.exports = userRouter;