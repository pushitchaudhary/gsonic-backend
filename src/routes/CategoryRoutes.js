import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  getNavbarData,
} from "../controllers/CategoryController.js";

import protect from "../middlewares/protectUser.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category & SubCategory management APIs
 */

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               categories:
 *                 - _id: "cat1"
 *                   name: "Chest Freezer"
 *                 - _id: "cat2"
 *                   name: "TV"
 */
router.get("/categories", getCategories);

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Refrigerator"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               category:
 *                 _id: "cat1"
 *                 name: "Refrigerator"
 *       400:
 *         description: Duplicate category or validation error
 */
router.post("/categories", protect, createCategory);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             name: "Updated Category"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
router.put("/categories/:id", protect, updateCategory);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete("/categories/:id", protect, deleteCategory);

/**
 * @swagger
 * /api/v1/subcategories:
 *   get:
 *     summary: Get all subcategories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of subcategories
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               subCategories:
 *                 - _id: "sub1"
 *                   name: "Hard Top Single Door"
 *                   category:
 *                     name: "Chest Freezer"
 */
router.get("/subcategories", getSubCategories);

/**
 * @swagger
 * /api/v1/subcategories:
 *   post:
 *     summary: Create a subcategory
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "LED"
 *             category: "categoryId"
 *     responses:
 *       201:
 *         description: SubCategory created successfully
 *       404:
 *         description: Category not found
 */
router.post("/subcategories", protect, createSubCategory);

/**
 * @swagger
 * /api/v1/subcategories/{id}:
 *   put:
 *     summary: Update a subcategory
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SubCategory ID
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             name: "OLED"
 *     responses:
 *       200:
 *         description: SubCategory updated successfully
 *       404:
 *         description: SubCategory not found
 */
router.put("/subcategories/:id", protect, updateSubCategory);

/**
 * @swagger
 * /api/v1/subcategories/{id}:
 *   delete:
 *     summary: Delete a subcategory
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SubCategory ID
 *     responses:
 *       200:
 *         description: SubCategory deleted successfully
 *       404:
 *         description: SubCategory not found
 */
router.delete("/subcategories/:id", protect, deleteSubCategory);


router.get("/navbar", getNavbarData);

export default router;
