const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    title: {
        type: String
    },
    message: {
        type: String,
      },
    status: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Notification", notificationSchema);