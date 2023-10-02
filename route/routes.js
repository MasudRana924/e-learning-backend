const express = require("express");
const { createUser,loginUser, verifyEmail, getUserInfo, logout, updateInfo, updatePassword, updateAvatar, getAllUsers  } = require("../Controllers/user");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const { createCourse,  getSingleCourses, editCourse, getuserCourses, getAllCourses } = require("../Controllers/course");
const { createOrder, getAllOrders } = require("../Controllers/order");
const { getNotifications, updateNotifications } = require("../Controllers/notification");
const router = express.Router();

// users routes
router.route("/register").post(createUser);
router.route("/activation").post(verifyEmail);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/currentUserInfo").get(isAuthenticatedUser, getUserInfo);
router.route("/update/info").put(isAuthenticatedUser, updateInfo);
router.route("/update/password").put(isAuthenticatedUser, updatePassword);
router.route("/update/avatar").put(isAuthenticatedUser, updateAvatar);
router.route("/get/allusers").get(isAuthenticatedUser, getAllUsers);

// 
router.route("/create/course").post(createCourse);
router.route("/get/courses").get(getAllCourses);
router.route("/course/:id").get(getSingleCourses);
router.route("/update/course/:id").put(editCourse);
router.route("/get/user/course/:id").get(isAuthenticatedUser,getuserCourses);
// order
router.route("/create/order").post(isAuthenticatedUser,createOrder);
router.route("/get/notifications").get(isAuthenticatedUser,getNotifications);
router.route("/update/notifications/:id").put(isAuthenticatedUser,updateNotifications);
router.route("/get/all/orders").get(isAuthenticatedUser,getAllOrders);




module.exports = router;