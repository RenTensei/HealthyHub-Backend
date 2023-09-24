const { handlerWrapper } = require('../helpers');
const FoodIntakeModel = require('../models/FoodIntake/FoodIntakeModel');
const { SaveFoodIntakeValidationSchema } = require('../models/FoodIntake/FoodIntakeSchema');
const FoodAllModel = require('../models/FoodIntake/RecomendedFoodModel');
const WaterIntakeModel = require('../models/WaterIntake/WaterIntakeModel');

const createMeal = async (req, res) => {
  const validatedBody = SaveFoodIntakeValidationSchema.parse(req.body);

  const createdFoodIntake = await FoodIntakeModel.create({
    ...validatedBody,
    consumer: req.user._id,
  });

  res.json(createdFoodIntake);
};

const getDiaryFood = async (req, res) => {
  const currentData = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const foodIntakes = await FoodIntakeModel.find({
    consumer: req.user._id,
    createdAt: {
      $gte: todayStart,
      $lte: currentData,
    },
  });

  const waterIntake = await WaterIntakeModel.aggregate([
    {
      $match: {
        consumer: req.user._id,
        createdAt: {
          $gte: todayStart,
          $lte: currentData,
        },
      },
    },
    {
      $group: { _id: null, totalVolume: { $sum: '$volume' } },
    },
    { $project: { _id: 0, totalVolume: 1 } },
  ]);

  res.json({
    items: foodIntakes,
    waterIntake: waterIntake.length > 0 ? waterIntake[0].totalVolume : 0,
  });
};

const getRecommendedFood = async (req, res) => {
  const result = await FoodAllModel.find({}, { _id: 0 });

  res.json(result);
};

module.exports = {
  createMeal: handlerWrapper(createMeal),
  getDiaryFood: handlerWrapper(getDiaryFood),
  getRecommendedFood: handlerWrapper(getRecommendedFood),
};
