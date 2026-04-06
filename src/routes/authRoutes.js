import express from "express";
import {
  getLoggedUser,
  login,
  logout,
  resigter,
} from "../controllers/authController.js";
import protect from "../middlewares/protectUser.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             firstname: "Baroon"
 *             lastname: "Shrestha"
 *             email: "baroon@example.com"
 *             phone: "9812345678"
 *             password: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               message: "User registration success."
 *               data:
 *                 _id: "userId"
 *                 firstname: "Baroon"
 *                 lastname: "Shrestha"
 *                 email: "baroon@example.com"
 *                 phone: "9812345678"
 *       400:
 *         description: Validation error / User already exists
 */
router.post("/register", resigter);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "baroon@example.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               message: "Login successful"
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/logged-user:
 *   get:
 *     summary: Get logged-in user details
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged-in user fetched
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               user:
 *                 _id: "userId"
 *                 firstname: "Baroon"
 *                 email: "baroon@example.com"
 *       401:
 *         description: Unauthorized
 */
router.get("/logged-user", protect, getLoggedUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Logged out successfully"
 */
router.post("/logout", logout);

export default router;
