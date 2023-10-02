const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    courseId: {
        type: String
    },
    price: {
        type: String,
      },
    userId: {
        // type: mongoose.Schema.ObjectId,
        // ref: "User",
        // required: true,
        type:String
    },
    trans_id: {
        type: String,
    },
    paymentInfo: {
        type: String,
        // required: true,
    },
    paidStatus: {
        type: String,
        default: false
    },
    paidAt: {
        type: Date,
        // required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", orderSchema);