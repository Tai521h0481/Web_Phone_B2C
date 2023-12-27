const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controller");
const {getCachedUsers,} = require("../middlewares/redis.middleware");
const {authenticate} = require("../middlewares/authenticate");

userRouter.get("/", getCachedUsers, userController.getAllUsers);
userRouter.get("/profile", authenticate, userController.getProfile);
userRouter.get("/:id", authenticate, userController.getUserById);
userRouter.post("/", userController.createUser);
userRouter.patch("/change-password", authenticate, userController.changePassword);
userRouter.patch("/:id", userController.updateUser);
userRouter.post("/login", userController.login);
// userRouter.post("/logout", userController.logout);
// userRouter.post("/recovery-password", userController.forgotPassword);
// userRouter.patch("/change-avatar", userController.changeAvatar);
userRouter.patch("/toggle-lock", userController.toggleLock);

module.exports = userRouter;