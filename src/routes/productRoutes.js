import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import protect from "../middlewares/protectUser.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs and Actions
 */

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products grouped by category
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         example: Chest Freezer
 *       - in: query
 *         name: subCategory
 *         schema:
 *           type: string
 *         example: Single Door
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: 220 lttre .....
 *     responses:
 *       200:
 *         description: Products grouped by category
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - category_id: "cat1"
 *                   category_name: "Mobile"
 *                   products:
 *                     - id: "prod12334"
 *                       name: "220 Litre... "
 *                       price: 100000
 *                       discountPrice: 90000
 *                       stock: 15
 *                       description: "For Daily home usage"
 *                       subCategory: "Single Door"
 *                       specs:
 *                         Capacity: "220 Litre"
 *                         Spaces: "Double Compartments"
 *                       image:
 *                         - public_id: "abc123"
 *                           url: "https://res.cloudinary.com/sample.png"
 *
 *                     - id: "prod2134"
 *                       name: "120 Litre Double Door"
 *                       price: 200000
 *                       discountPrice: 160000
 *                       stock: 10
 *                       description: "Latest Chrest freezer for Home use"
 *                       subCategory: "Double Door"
 *                       specs:
 *                         Capacity: "120 Litre"
 *                         Spaces: "Double Compartments with two doors"
 *                       image:
 *                         - public_id: "xyz789"
 *                           url: "https://res.cloudinary.com/sample.webp"
 *
 */
router.get("/products", getProducts);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               product:
 *                  id: "prod12334"
 *                  name: "220 Litre... "
 *                  price: 100000
 *                  discountPrice: 90000
 *                  stock: 15
 *                  description: "For Daily home usage"
 *                  subCategory: "Single Door"
 *                  specs:
 *                    Capacity: "220 Litre"
 *                    Spaces: "Double Compartments"
 *                  image:
 *                    - public_id: "abc123"
 *                      url: "https://res.cloudinary.com/sample.png"
 */
router.get("/products/:id", getProductById);

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               discountPrice:
 *                 type: number
 *               stock:
 *                 type: number
 *               category:
 *                 type: string
 *               subCategory:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               specs:   # ✅ NEW
 *                 type: string
 *                 description: JSON string of specs
 *                 example: '{"Capacity":"220 Litre","Space":"Single Door...."}'
 */
router.post("/products", protect, createProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   patch:
 *     summary: Update a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               discountPrice:
 *                 type: number
 *               stock:
 *                 type: number
 *               category:
 *                 type: string
 *               subCategory:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               specs:
 *                 type: string
 *                 description: JSON string of specs
 *                 example: '{"Capacity":"120 Ltre","Capacity":"Double Door"}'
 */
router.patch("/products/:id", protect, updateProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *            type: string
 *         description: Product ID
 *     responses:
 *       200:
 *          description : Product deleted successfully
 */
router.delete("/products/:id", protect, deleteProduct);

export default router;
