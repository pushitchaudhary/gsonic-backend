import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategoryMode.js";
import Product from "../models/productModel.js"
import AppError from "../utils/appError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// Create Category
export const createCategory = asyncErrorHandler(async (req, res, next) => {
  const { name } = req.body;
  const category = await Category.create({ name });
  res.status(201).json({ success: true, category });
});

// Get Categories
export const getCategories = asyncErrorHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({ success: true, categories });
});

// Update Category
export const updateCategory = asyncErrorHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!category) return next(new AppError("Category not found", 404));
  res.status(200).json({ success: true, category });
});

// Delete Category
export const deleteCategory = asyncErrorHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError("Category not found", 404));
  await category.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "Category deleted successfully" });
});

// Create SubCategory
export const createSubCategory = asyncErrorHandler(async (req, res, next) => {
  const { name, category } = req.body;
  const categoryExists = await Category.findById(category);
  if (!categoryExists) return next(new AppError("Category not found", 404));

  const subCategory = await SubCategory.create({ name, category });
  res.status(201).json({ success: true, subCategory });
});

// Get SubCategories
export const getSubCategories = asyncErrorHandler(async (req, res) => {
  const subCategories = await SubCategory.find().populate("category", "name");
  res.status(200).json({ success: true, subCategories });
});

// Update SubCategory
export const updateSubCategory = asyncErrorHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  if (!subCategory) return next(new AppError("SubCategory not found", 404));
  res.status(200).json({ success: true, subCategory });
});

// Delete SubCategory
export const deleteSubCategory = asyncErrorHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory) return next(new AppError("SubCategory not found", 404));
  await subCategory.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "SubCategory deleted successfully" });
});

// Navbar Category 
export const getNavbarData = asyncErrorHandler(async (req, res) => {
  const categories = await Category.find().lean();
  const subCategories = await SubCategory.find().lean();
  const products = await Product.find().lean();

  const result = categories
    .map((cat) => ({
      title: cat.name,
      categories: subCategories
        .filter(
          (sub) => sub.category.toString() === cat._id.toString()
        )
        .map((sub) => ({
          name: sub.name,
          items: products
            .filter(
              (prod) =>
                prod.subCategory.toString() === sub._id.toString()
            )
            .map((prod) => ({
              label: prod.name,
              price: prod.price,
            })),
        }))
        .filter((sub) => sub.items.length > 0),
    }))
    .filter((cat) => cat.categories.length > 0);

  res.status(200).json({
    success: true,
    data: result,
  });
});
