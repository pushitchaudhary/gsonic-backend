import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import cloudinary from "cloudinary";

const createAdmin = async () => {
  try {
    const adminEmail = "admingsonic@gmail.com";
    const adminPassword = "admin123";

    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Optional: Upload default admin image from URL
    let profileImg = {
      public_id: "default_zwcp1h",
      url: "https://res.cloudinary.com/dxu7hzo7w/image/upload/v1774330152/profile_ryeo1l.avif",
    };

    const admin = await User.create({
      firstname: "Gsonic",
      lastname: "admin",
      phone: "9807654321",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      profileImg: profileImg,
    });

    console.log(`Admin created successfully: ${admin.email}`);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
  }
};

export default createAdmin;
