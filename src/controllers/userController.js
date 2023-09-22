const { handlerWrapper } = require('../helpers');
const FoodIntakeModel = require('../models/FoodIntake/FoodIntakeModel');
const WaterIntakeModel = require('../models/WaterIntake/WaterIntakeModel');
const UserModel = require('../models/User/UserModel');
const {
  UpdateGoalValidationSchema,
  UpdateUserValidationSchema,
  UpdateWeightValidationSchema,
} = require('../models/User/UserSchemas');
const calculateBMR = require('../utils/calculateBMR');
const extractUpdatedFields = require('../utils/extractUpdatedFields');

const WeightIntakeModel = require('../models/WeightIntake/WeightIntakeModel');

//Time endpoints
//__________________________________________________________
const currentData = new Date();
const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
const beforeMonth = new Date(
  new Date(new Date().setHours(0, 0, 0, 0)).setMonth(
    new Date(new Date().setHours(0, 0, 0, 0)).getMonth() - 1
  )
);
const beforeYear = new Date(
  new Date(new Date().setHours(0, 0, 0, 0)).setFullYear(
    new Date(new Date().setHours(0, 0, 0, 0)).getFullYear() - 1
  )
);
//  Period selection
let startDate = todayStart;
const endDate = currentData;
//_______________________________

const statistics = async (req, res) => {
  // TODO calculate calories, water based on foodIntake
  const { range } = req.query;
  if (range === 'month') {
    startDate = beforeMonth;
  } else if (range === 'year') {
    startDate = beforeYear;
  }
  //----------------------------------------------------------------
  const amountWater = await WaterIntakeModel.aggregate([
    {
      $match: {
        consumer: req.user._id,
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: 'createdAt',
        total: { $sum: '$volume' },
      },
    },
  ]);

  const amountCalories = await FoodIntakeModel.aggregate([
    {
      $match: {
        consumer: req.user._id,
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: 'Calories',
        total: { $sum: '$calories' },
      },
    },
  ]);

  const waterIntake = amountWater.length === 0 ? 0 : amountWater[0].total;
  const caloriesIntake = amountCalories.length === 0 ? 0 : amountCalories[0].total;

  res.json({ waterIntake, caloriesIntake, weight: req.user.weight });
};

const updateUser = async (req, res) => {
  const validatedBody = UpdateUserValidationSchema.parse(req.body);

  const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, { new: true });

  const { gender, height, weight, age, physicalActivityRatio } = updatedUser;
  validatedBody.BMR = calculateBMR({ gender, height, weight, age, physicalActivityRatio });

  const updatedBMRUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, {
    new: true,
  });
  const updatedFields = extractUpdatedFields(validatedBody, updatedBMRUser);

  // res.json({ user: { ...updatedFields } });
  res.json(updatedFields);
};

const updateUserGoal = async (req, res) => {
  const validatedBody = UpdateGoalValidationSchema.parse(req.body);

  const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, { new: true });

  const { gender, height, weight, age, physicalActivityRatio } = updatedUser;
  validatedBody.BMR = calculateBMR({ gender, height, weight, age, physicalActivityRatio });

  const updatedBMRUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, {
    new: true,
  });

  extractUpdatedFields(validatedBody, updatedBMRUser);
  res.json({ goal: updatedUser.goal });
};

const updateUserWeight = async (req, res) => {
  const validatedBody = UpdateWeightValidationSchema.parse(req.body);

  const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, { new: true });

  const { gender, height, weight, age, physicalActivityRatio } = updatedUser;
  validatedBody.BMR = calculateBMR({ gender, height, weight, age, physicalActivityRatio });

  const updatedBMRUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, {
    new: true,
  });
  //
  const todayWeight = await WeightIntakeModel.aggregate([
    {
      $match: {
        consumer: req.user._id,
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
  ]);

  const updateUser =
    todayWeight.length === 0
      ? await WeightIntakeModel.create({
          weight: updatedBMRUser.weight,
          consumer: req.user._id,
        })
      : await WeightIntakeModel.findOneAndUpdate(
          todayWeight[0]._id,
          { weight: updatedBMRUser.weight },
          { new: true }
        );

  extractUpdatedFields(validatedBody, updatedBMRUser);
  res.json({
    weight: updatedBMRUser.weight,
  });
};

module.exports = {
  statistics: handlerWrapper(statistics),
  updateUser: handlerWrapper(updateUser),
  updateUserGoal: handlerWrapper(updateUserGoal),
  updateUserWeight: handlerWrapper(updateUserWeight),
};
