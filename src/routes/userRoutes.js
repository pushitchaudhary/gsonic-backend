import express from "express";
import protect from "../middlewares/protectUser.js";
import {
  changePassword,
  updateProfile,
} from "../controllers/userController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /api/v1/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: old123
 *               newPassword:
 *                 type: string
 *                 example: new12345
 *               confirmPassword:
 *                 type: string
 *                 example: new12345
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

router.patch("/change-password", protect, changePassword);

/**
 * @swagger
 * /api/v1/update-profile/{id}:
 *   patch:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: Baroon
 *               lastname:
 *                 type: string
 *                 example: Shrestha
 *               phone:
 *                 type: string
 *                 example: "9800000000"
 *               profileImg:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.patch("/update-profile/:id", protect, updateProfile);

export default router;
