const { handlerWrapper } = require('../helpers');

const { SaveFoodIntakeValidationSchema } = require('../models/FoodIntake/FoodIntakeSchema');
const FoodIntakeModel = require('../models/FoodIntake/FoodIntakeModel');
const FoodAllModel = require('../models/FoodIntake/RecomendedFoodModel');

// const getAll = async (req, res) => {
//   const foodIntakes = await FoodIntakeModel.find({ consumer: req.user._id });
//   res.json(foodIntakes);
// };

const create = async (req, res) => {
  const validatedBody = SaveFoodIntakeValidationSchema.parse(req.body);

  const createdFoodIntake = await FoodIntakeModel.create({
    ...validatedBody,
    consumer: req.user._id,
  });

  res.json(createdFoodIntake);
};

const getDiaryFood = async (req, res) => {
  const currentData = new Date();
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
  // const todayEnd = new Date(new Date().setHours(23, 59, 59, 999));

  const result = await FoodIntakeModel.find({
    consumer: req.user._id,
    createdAt: {
      $gte: todayStart,
      $lte: currentData,
      // $lte: todayEnd,
    },
  }).exec();

  res.json(result);
};

const getRecommendedFood = async (req, res) => {
  const result = await FoodAllModel.find({}, { _id: 0 });

  res.json(result);
};

module.exports = {
  // getAll: handlerWrapper(getAll),
  create: handlerWrapper(create),
  getDiaryFood: handlerWrapper(getDiaryFood),
  getRecommendedFood: handlerWrapper(getRecommendedFood),
};
