import Feedback from "../models/feedbackModel.js";
import { uploadImages } from "../utils/imageUploader.js";

// create feedback 
export const createFeedback = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, message } = req.body;

    let imageData = null;
    if (req.files && req.files.image) {
      imageData = await uploadImages(req.files.image);
    }

    const feedback = await Feedback.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      message,
      image: imageData ? imageData.url : null,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating feedback",
      error: error.message,
    });
  }
};

// get feedback 
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({
      total: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching feedback",
      error: error.message,
    });
  }
};