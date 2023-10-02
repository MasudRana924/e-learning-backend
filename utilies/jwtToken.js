
const sendToken = (user, statusCode, res,activationCode) => {
   const token = user.getJWTToken();
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    Secure: true,
  };
  res.status(statusCode).cookie("token", token,activationCode, options).json({
    success: true,
    user,
    token,
    activationCode
  });
};

module.exports = sendToken;