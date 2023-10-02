const notificationModel = require('../models/Notification');
const cloudinary = require('cloudinary');
const ErrorHandler = require('../utilies/ErrorHandler');
var cron = require('node-cron');
exports.getNotifications= async (req, res) => {
    const notifications = await notificationModel.find().sort({createdAt:-1});
    res.status(200).json({ success: true, notifications });
  };
exports.updateNotifications= async (req, res) => {
    try{
        const notification = await notificationModel.findById(req.params.id);
        if(!notification){
            return next(new ErrorHandler("Notification is not Found", 400));
        }else{
            notification.status?(notification.status="read"):notification?.status
        }
        await notification.save();
        const notifications = await notificationModel.find().sort({createdAt:-1});
        res.status(200).json({ success: true, notifications });
    }catch(error){
        return next(new ErrorHandler(error.message, 400));
    }

  };

cron.schedule('0 0 0 * * * ', async() => {
    const thirthyDaysago=new Date(Date.now()-30*24*60*60*1000);
    await notificationModel.deleteMany({status:"read",createdAt:{$lt:thirthyDaysago}});
    console.log("Deleted Read Notifications");
  });