import CategoryModel from "../models/category.js";

const CategoriesController = {
  // [POST] /api/categories/create/ {name, active}
  create: async (req, res, next) => {
    try {
      const { name, active } = req.body;

      const category = await CategoryModel.create({ name, active });

      return res.status(201).json(category);
    } catch (error) {
      return next(error);
    }
  },

  // [GET] /api/categories/
  getAllCategory: async (req, res, next) => {
    try {
      const categories = await CategoryModel.find();
      if (!categories) {
        return res.status(404).send("Categories not found");
      }
      return res.status(200).json(categories);
    } catch (error) {
      return next(error);
    }
  },
  // [GET] /api/categories/:id
  getCategoryById: async (req, res, next) => {
    try {
      const category = await CategoryModel.findById({ _id: req.params.id });
      if (!category) {
        return res.status(404).send("Category not found!!!");
      }
      return res.status(200).json(category);
    } catch (error) {
      return next(error);
    }
  },

  //[DELETE] /api/categories/:id
  delete: async (req, res, next) => {
    try {
      const category = await CategoryModel.delete({ _id: req.params.id });

      if (category.modifiedCount === 0) {
        return res.status(400).send("Something wrong!!!");
      }
      return res.status(200).send("Category has delete");
    } catch (error) {
      return next(error);
    }
  },
};

export default CategoriesController;
