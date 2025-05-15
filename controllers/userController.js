const User = require("../models/User");
const bcrypt = require("bcrypt");
// const userController = require('express').Router();
const Post = require("../models/Post");
const verifyToken = require("../middlewares/verifyToken");

const userController = {
  // get Suggested users
  suggestedUsers: async (req, res) => {
    try {
      const currentUser = await User.findById(req.user.id);
      const users = await User.find({}).select("-password");

      // if we don't follow this user and the user is not currentUser

      let suggestedUsers = users.filter((user) => {
        return (
          !currentUser.followings.includes(user._id) &&
          user._id.toString() !== currentUser._id.toString()
        );
      });

      if (suggestedUsers.length > 5) {
        suggestedUsers = suggestedUsers.slice(0, 5);
      }

      return res.status(200).json(suggestedUsers);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  // get Friends
  findFriends: async (req, res) => {
    try {
      const currentUser = await User.findById(req.user.id);
      const friends = await Promise.all(
        currentUser.followings.map((friendId) => {
          return User.findById(friendId).select("-password");
        })
      );

      return res.status(200).json(friends);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  // get one
  findUserId: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);

      if (!user) {
        return res.status(400).json({ msg: "No user found with this id" });
      }

      const { password, ...others } = user._doc;

      return res.status(200).json(others);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  // get all
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});

      const formattedUsers = users.map((user) => {
        return {
          username: user.username,
          email: user.email,
          _id: user._id,
          createdAt: user.createdAt,
        };
      });

      return res.status(200).json(formattedUsers);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  // update
  updateUser: async (req, res) => {
    if (req.params.userId.toString() === req.user.id.toString()) {
      try {
        if (req.body.password) {
          req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(
          req.params.userId,
          { $set: req.body },
          { new: true }
        );
        return res.status(200).json(updateUser);
      } catch (error) {
        return res.status(500).json(error.message);
      }
    } else {
      return res
        .status(400)
        .json({ msg: "You can only change your profile details only" });
    }
  },
  // delete

  deleteUser: async (req, res) => {
    if (req.params.userId === req.user.id) {
      try {
        await User.findByIdAndDelete(req.user.id);

        return res.status(200).json({ msg: "User deleted successfully" });
      } catch (error) {
        return res.status(500).json(error.message);
      }
    } else {
      return res
        .status(400)
        .json({ msg: "You can only able to delete your profile/account" });
    }
  },

  // follow or unfollow
  followUnfollow: async (req, res) => {
    try {
      const currentUserId = req.user.id;
      const otherUserId = req.params.otherUserId;

      if (currentUserId === otherUserId) {
        throw new Error("You can't follow yourself");
      }

      const currentUser = await User.findById(currentUserId);
      const otherUser = await User.findById(otherUserId);

      if (!currentUser.followings.includes(otherUserId)) {
        currentUser.followings.push(otherUserId);
        otherUser.followers.push(currentUserId);

        await User.findByIdAndUpdate(
          currentUserId,
          { $set: currentUser },
          { new: true }
        );
        await User.findByIdAndUpdate(
          otherUserId,
          { $set: otherUser },
          { new: true }
        );

        return res.status(200).json({
          msg: `You have successfully followed the ${otherUser.username}!`,
        });
      } else {
        currentUser.followings = currentUser.followings.filter(
          (id) => id !== otherUserId
        );
        otherUser.followers = otherUser.followers.filter(
          (id) => id !== currentUserId
        );

        await User.findByIdAndUpdate(
          currentUserId,
          { $set: currentUser },
          { new: true }
        );
        await User.findByIdAndUpdate(
          otherUserId,
          { $set: otherUser },
          { new: true }
        );

        return res.status(200).json({
          msg: `You have successfully unfollowed the ${otherUser.username}!`,
        });
      }
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  // bookmark

  bookmarkPost: async (req, res) => {
    try {
      
      const post = await Post.findById(req.params.postId).populate(
        "user",
        "-password"
      );
      if (!post) {
        return res.status(500).json({ msg: "No such post" });
      } else {
        console.log("enter into bookmarkedpost in usercontroller ",post);
        if (
          post.user.bookmarkedPosts.some((post) => post._id === req.params.postId)) {
          
          await User.findByIdAndUpdate(req.user.id, {
            $pull: { bookmarkedPosts: post },
          });
          console.log("bookmarkedpost removed", post);
          return res
            .status(200)
            .json({ msg: "Successfully unbookmarked the post" });
        } else {
          await User.findByIdAndUpdate(req.user.id, {$addToSet: { bookmarkedPosts: post },});

          console.log("bookmarkedpost added", post);
          return res
            .status(200)
            .json({ msg: "Successfully boomkarked the post" });
        }
      }
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};

module.exports = userController;
