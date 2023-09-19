const { handlerWrapper } = require('../helpers');

const { SaveFoodIntakeValidationSchema } = require('../models/FoodIntake/FoodIntakeSchema');
const FoodIntakeModel = require('../models/FoodIntake/FoodIntakeModel');
const FoodAllModel = require('../models/FoodIntake/RecomendedFoodModel');

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

const getDiaryFood = async (req, res) => {
  console.log(req.query.date);
  const result = await FoodIntakeModel.find({
    createdAt: {
      // $gte: req.query.date,
      $lte: req.query.date,
    },
  }).exec();

  res.json(result);
};
const getAllFood = async (req, res) => {
  const result = await FoodAllModel.find({}, { _id: 0 });

  res.json(result);
};

module.exports = {
  create: handlerWrapper(create),
};
