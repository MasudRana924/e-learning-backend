const courseModel = require('../models/Course');
const cloudinary = require('cloudinary');
const ErrorHandler = require('../utilies/ErrorHandler');


exports.createCourse = async (req, res, next) => {
  try {

    // const { title, price, tags,demoUrl, description, thumbnail, courseData, reviews } = req.body;
    const data = req.body;
    const thumbnail=data.thumbnail
    if (thumbnail) {
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "courses",
      });
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      }
    }
     const courses = await courseModel.create(data);
    res.status(201).json({
      success: true,
      courses,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
}
exports.getAllCourses = async (req, res) => {
  const courses = await courseModel.find().sort({createdAt:-1}).select("-courseData.videoUrl");
  res.status(200).json({ success: true, courses });
};
exports.getSingleCourses = async (req, res) => {
  const course = await courseModel.findById(req.params.id).select("-courseData.videoUrl");
  res.status(200).json({ success: true, course });
}
exports.editCourse=async(req,res,next)=>{
  try{
      const courseId = await courseModel.findById(req.params.id);
       const data=req.body;
       const thumbnail=data.thumbnail;
       if(thumbnail){
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        const myCloud=await cloudinary.v2.uploader.upload(thumbnail,{
            folder:"courses",
        });
        data.thumbnail={
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
       }
       const updateCourse=await courseModel.findByIdAndUpdate(courseId,{$set:data},{new:true});
       res.status(200).json({ success: true, updateCourse });

  }catch(error){
    return next(new ErrorHandler(error.message, 400));
  }
}
// user got his courses
exports.getuserCourses = async (req, res) => {
  const course = await courseModel.findById(req.params.id);
  const courseContent=course?.courseData
  res.status(200).json({ success: true, courseContent });
}