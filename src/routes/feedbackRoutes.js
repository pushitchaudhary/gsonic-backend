import express from "express";
import {
  createFeedback,
  getAllFeedback,
} from "../controllers/feebackController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Product feedback and reviews APIs
 */

/**
 * @swagger
 * /api/v1/send-feedback/{productId}:
 *   post:
 *     summary: Submit anonymous feedback for a product
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "This shop's customer service is really good."
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Feedback created successfully"
 *               feedback:
 *                 _id: "feedbackId"
 *                 name: "GS-4823"
 *                 product: "69ba91844e812a0c48ada750"
 *                 rating: 4
 *                 comment: "This shop's customer service is really good."
 *                 createdAt: "2026-03-18T12:00:00.000Z"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Error creating feedback"
 *               error: "Internal server error"
 */
router.post("/send-feedback/:productId", createFeedback);

/**
 * @swagger
 * /api/v1/get-feedback/{productId}:
 *   get:
 *     summary: Get all feedback for a product
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of feedbacks for the product (newest first)
 *         content:
 *           application/json:
 *             example:
 *               total: 2
 *               feedbacks:
 *                 - _id: "feedback1"
 *                   name: "GS-4823"
 *                   product: "69ba91844e812a0c48ada750"
 *                   rating: 5
 *                   comment: "Excellent product!"
 *                   createdAt: "2026-03-18T12:00:00.000Z"
 *                 - _id: "feedback2"
 *                   name: "GS-1047"
 *                   product: "69ba91844e812a0c48ada750"
 *                   rating: 3
 *                   comment: "Average quality"
 *                   createdAt: "2026-03-17T09:00:00.000Z"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Error fetching feedback"
 *               error: "Internal server error"
 */
router.get("/get-feedback/:productId", getAllFeedback);

export default router;
