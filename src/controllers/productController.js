import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategoryMode.js";
import AppError from "../utils/appError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { uploadImages } from "../utils/imageUploader.js";
import {
  findOrCreateCategory,
  findOrCreateSubCategory,
} from "../utils/findOrCreate.js";
import { v2 as cloudinary } from "cloudinary";

export const createProduct = asyncErrorHandler(async (req, res, next) => {
  const {
    name,
    description,
    price,
    discountPrice,
    stock,
    category,
    subCategory,
    specs,
  } = req.body;

  // 1️⃣ Find or Create Category
  const categoryDoc = await findOrCreateCategory(Category, category);

  // 2️⃣ Find or Create SubCategory (linked to category)
  let subCategoryDoc = null;

  if (subCategory) {
    subCategoryDoc = await findOrCreateSubCategory(
      SubCategory,
      subCategory,
      categoryDoc._id,
    );
  }

  // 3️⃣ Upload image
  let imageData = null;
  if (req.files?.image) {
    imageData = await uploadImages(req.files.image);
  }

  let parsedSpecs = {};

  if (specs) {
    parsedSpecs = typeof specs === "string" ? JSON.parse(specs) : specs;
  }

  // 4️⃣ Create Product
  const product = await Product.create({
    name,
    description,
    price,
    discountPrice,
    stock,
    category: categoryDoc._id,
    subCategory: subCategoryDoc?._id,
    specs: parsedSpecs,
    image: imageData
      ? [{ public_id: imageData.public_id, url: imageData.url }]
      : [],
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

export const getProducts = asyncErrorHandler(async (req, res) => {
  const { category, subCategory, search } = req.query;

  let query = {};

  // 🔍 Filter by category name
  if (category) {
    const categoryDoc = await Category.findOne({
      name: { $regex: `^${category.trim()}$`, $options: "i" },
    });

    if (categoryDoc) {
      query.category = categoryDoc._id;
    } else {
      return res.status(200).json({ success: true, data: [] });
    }
  }

  // 🔍 Filter by subcategory name — use partial match instead of exact
  if (subCategory) {
    const subCategoryDoc = await SubCategory.findOne({
      name: { $regex: subCategory.trim(), $options: "i" },
    });

    if (subCategoryDoc) {
      query.subCategory = subCategoryDoc._id;
    } else {
      return res.status(200).json({ success: true, data: [] });
    }
  }

  // 🔍 Search by product name
  if (search) {
    query.name = { $regex: search.trim(), $options: "i" };
  }

  // 📦 Fetch products
  const products = await Product.find(query)
    .populate("category", "name")
    .populate("subCategory", "name");

  // ✅ Guard: skip products where category failed to populate
  const validProducts = products.filter((p) => p.category);

  // 📊 Group by category
  const grouped = {};

  validProducts.forEach((p) => {
    const catId = p.category._id.toString();

    if (!grouped[catId]) {
      grouped[catId] = {
        category_id: p.category._id,
        category_name: p.category.name,
        products: [],
      };
    }

    grouped[catId].products.push({
      id: p._id,
      name: p.name,
      price: p.price,
      discountPrice: p.discountPrice || null,
      stock: p.stock,
      description: p.description || null,
      subCategory: p.subCategory?.name || null,
      specs: Object.fromEntries(p.specs || {}),
      image: p.image,
    });
  });

  res.status(200).json({
    success: true,
    count: validProducts.length,
    data: Object.values(grouped),
  });
});

export const getProductById = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name")
    .populate("subCategory", "name");

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product: {
      ...product.toObject(),
      specs: Object.fromEntries(product.specs || {}),
    },
  });
});

export const updateProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const {
    name,
    description,
    price,
    discountPrice,
    stock,
    category,
    subCategory,
    specs,
  } = req.body || {};

  let updateData = {};

  if (name) updateData.name = name;
  if (description) updateData.description = description;
  if (price) updateData.price = price;
  if (discountPrice) updateData.discountPrice = discountPrice;
  if (stock) updateData.stock = stock;

  if (category) {
    const categoryDoc = await findOrCreateCategory(Category, category);
    updateData.category = categoryDoc._id;

    if (subCategory) {
      const subCategoryDoc = await findOrCreateSubCategory(
        SubCategory,
        subCategory,
        categoryDoc._id,
      );
      updateData.subCategory = subCategoryDoc._id;
    } else {
      updateData.subCategory = null;
    }
  } else if (subCategory) {
    const subCategoryDoc = await SubCategory.findOne({
      name: { $regex: `^${subCategory}$`, $options: "i" },
    });

    if (!subCategoryDoc) {
      return next(new AppError("SubCategory not found", 404));
    }

    updateData.subCategory = subCategoryDoc._id;
  }

  if (req.files?.image) {
    if (product.image?.length > 0 && product.image[0]?.public_id) {
      await cloudinary.uploader.destroy(product.image[0].public_id);
    }

    const uploadedImage = await uploadImages(req.files.image);

    updateData.image = [
      { public_id: uploadedImage.public_id, url: uploadedImage.url },
    ];
  }

  if (specs) {
    const parsedSpecs = typeof specs === "string" ? JSON.parse(specs) : specs;

    updateData.specs = parsedSpecs;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true },
  )
    .populate("category", "name")
    .populate("subCategory", "name");

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

export const deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
