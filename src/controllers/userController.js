import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { uploadImages } from "../utils/imageUploader.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";

export const changePassword = asyncErrorHandler(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // 1. Validate input
  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new AppError("All fields are required", 400));
  }

  // 2. Check if new passwords match
  if (newPassword !== confirmPassword) {
    return next(new AppError("New passwords do not match", 400));
  }

  // 3. Get user from DB (include password)
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // 4. Check current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return next(new AppError("Current password is incorrect", 400));
  }

  // 5. Prevent same password reuse
  const isSame = await bcrypt.compare(newPassword, user.password);

  if (isSame) {
    return next(
      new AppError("New password must be different from old password", 400),
    );
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  // 8. Send response
  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

export const updateProfile = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user.id;

  const { firstname, lastname, phone } = req.body || {};

  const user = await User.findById(userId);
  if (!user) return next(new AppError("Admin not found", 404));

  // update profile image
  if (req.files && req.files.profileImg) {
    if (user.profileImg && user.profileImg.public_id) {
      await cloudinary.v2.uploader.destroy(user.profileImg.public_id);
    }

    const uploadedImage = await uploadImages(req.files.profileImg);
    user.profileImg = uploadedImage;
  }

  // update fields if provided
  if (firstname) user.firstname = firstname;
  if (lastname) user.lastname = lastname;
  if (phone) user.phone = phone;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});
