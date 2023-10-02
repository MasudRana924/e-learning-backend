const mongoose = require('mongoose');


const courseSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  tags: [{
    title: String,
  }],
  price: {
    type: String,
  },
  description: {
    type: String,
  },
  thumbnail: {
    public_id:String,
    url:String
  },
  demoUrl: {
    type: String,
  },
  purchased: {
    type: Number,
    default:0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        // required: true,
      },
      name: {
        type: String,
        // required: true,
      },
      rating: {
        type: Number,
        // required: true,
      },
      comment: {
        type: String,
        // required: true,
      },
    },
  ],
  courseData: [
    {
      title: String,
      description: String,
      videoUrl: String,
      reviews: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            // required: true,
          },
          name: {
            type: String,
            // required: true,
          },
          rating: {
            type: Number,
            // required: true,
          },
          comment: {
            type: String,
            // required: true,
          },
        },
      ],
    }
  ],
  createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Course", courseSchema);
