const { handlerWrapper } = require('../helpers');
const FoodIntakeModel = require('../models/FoodIntake/FoodIntakeModel');
const { SaveFoodIntakeValidationSchema } = require('../models/FoodIntake/FoodIntakeSchema');

const getAll = async (req, res) => {
  const foodIntakes = await FoodIntakeModel.find({ consumer: req.user._id });
  res.json(foodIntakes);
};

const create = async (req, res) => {
  const validatedBody = SaveFoodIntakeValidationSchema.parse(req.body);

  const createdFoodIntake = await FoodIntakeModel.create({
    ...validatedBody,
    consumer: req.user._id,
  });

  res.json(createdFoodIntake);
};

module.exports = {
  create: handlerWrapper(create),
  getAll: handlerWrapper(getAll),
};
