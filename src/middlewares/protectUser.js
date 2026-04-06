// import jwt from "jsonwebtoken";
// import AppError from "../utils/appError.js";
// import asyncErrorHandler from "../utils/asyncErrorHandler.js";
// import User from "../models/userModel.js";

// const protect = asyncErrorHandler(async (req, res, next) => {
//   let token;

//   if (req.cookies.token) {
//     token = req.cookies.token;
//   }

//   if (!token) {
//     return next(new AppError("Not authorized.", 401));
//   }

//   if (!token) {
//     return next(new AppError("Not authorized. No token provided.", 401));
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   const user = await User.findById(decoded.id).select("-password");

//   if (!user) {
//     return next(new AppError("User not found.", 404));
//   }

//   req.user = user;

//   next();
// });

// export default protect;



import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import User from "../models/userModel.js";

const protect = asyncErrorHandler(async (req, res, next) => {
  let token;

  // Cookie बाट token लिन्छ
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Bearer token बाट लिन्छ (frontend Authorization header)
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Not authorized. No token provided.", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  req.user = user;

  next();
});

export default protect;