export const findOrCreateCategory = async (Category, name) => {
  const trimmed = name.trim();

  let category = await Category.findOne({
    name: { $regex: `^${trimmed}$`, $options: "i" },
  });

  if (!category) {
    category = await Category.create({ name: trimmed });
  }

  return category;
};

export const findOrCreateSubCategory = async (
  SubCategory,
  name,
  categoryId,
) => {
  const trimmed = name.trim();

  let subCategory = await SubCategory.findOne({
    name: { $regex: `^${trimmed}$`, $options: "i" },
    category: categoryId,
  });

  if (!subCategory) {
    subCategory = await SubCategory.create({
      name: trimmed,
      category: categoryId,
    });
  }

  return subCategory;
};
