const OrderModel = require("../models/Order");
const userModel = require("../models/User");
const courseModel = require("../models/Course");
const notificationModel = require("../models/Notification");
const ErrorHandler = require("../utilies/ErrorHandler");
const SendEmail = require("../utilies/sendEmail");

exports.createOrder = async (req, res, next) => {
    try {
        const { courseId, paymentInfo } = req.body;
        const user = await userModel.findById(req.user?._id);
        const courseInUser = user?.courses.some((course) => course._id.toString() == courseId);
        if (courseInUser) {
            return next(new ErrorHandler("You have already purchased this course", 400));
        }
        const course = await courseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 400));
        }
        const data = {
            courseId: course._id,
            userId: user?._id
        }
        const order = await OrderModel.create(data);
        user?.courses.push(course?._id);
        await user?.save();
        await notificationModel.create({
            user: user?._id,
            title: "New Purchase Order",
            status:"Unread",
            message: `You have a new order of ${course.title} from ${user.firstname} ${user.lastname}`
        })
        if (order) {
            SendEmail({
                email: user?.email,
                subject: "Purcahsed Order",
                message: `Congrats ${user?.firstname} ${user?.lastname} you have purchased ${course?.title} courses`,

            });
        }
        res.status(200).json({
            success: true,
            order
        });
       


    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
}

exports.getAllOrders = async (req, res) => {
    const orders = await OrderModel.find().sort({createdAt:-1});
    res.status(200).json({ success: true, orders });
  };