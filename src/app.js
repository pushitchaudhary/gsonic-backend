import express from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";

import authRoutes from "./routes/authRoutes.js";

import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import productRoutes from "./routes/productRoutes.js";
import CategoryRoutes from "./routes/CategoryRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import swaggerSpec from "./config/swagger.js";

const app = express();

// const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },

//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);

// routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", CategoryRoutes);
app.use("/api/v1", feedbackRoutes);
app.use("/api/v1", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(globalErrorHandler);

export default app;
