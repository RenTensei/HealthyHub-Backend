const { handlerWrapper } = require('../helpers');
const UserModel = require('../models/User/UserModel');
const {
  UpdateGoalValidationSchema,
  UpdateUserValidationSchema,
  UpdateWeightValidationSchema,
} = require('../models/User/UserSchemas');

const calculateBMR = require('../utils/calculateBMR');
const extractUpdatedFields = require('../utils/extractUpdatedFields');

const statistics = async (req, res) => {
  // TODO calculate calories, water based on foodIntake
  const caloriesIntake = 2100;
  const waterIntake = 1200;

  res.json({ waterIntake, caloriesIntake, weight: req.user.weight });
};

const updateUser = async (req, res) => {
  const validatedBody = UpdateUserValidationSchema.parse(req.body);

  const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, { new: true });

  const { goal, gender, height, weight, age, physicalActivityRatio } = updatedUser;
  validatedBody.BMR = calculateBMR({ goal, gender, height, weight, age, physicalActivityRatio });

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

  const { goal, gender, height, weight, age, physicalActivityRatio } = updatedUser;
  validatedBody.BMR = calculateBMR({ goal, gender, height, weight, age, physicalActivityRatio });

  const updatedBMRUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, {
    new: true,
  });

  extractUpdatedFields(validatedBody, updatedBMRUser);
  res.json({ goal: updatedUser.goal });
};

const updateUserWeight = async (req, res) => {
  const validatedBody = UpdateWeightValidationSchema.parse(req.body);

  const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, { new: true });

  const { goal, gender, height, weight, age, physicalActivityRatio } = updatedUser;
  validatedBody.BMR = calculateBMR({ goal, gender, height, weight, age, physicalActivityRatio });
  const updatedBMRUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, {
    new: true,
  });
  extractUpdatedFields(validatedBody, updatedBMRUser);
  res.json({ weight: updatedUser.weight });
};

module.exports = {
  statistics: handlerWrapper(statistics),
  updateUser: handlerWrapper(updateUser),
  updateUserGoal: handlerWrapper(updateUserGoal),
  updateUserWeight: handlerWrapper(updateUserWeight),
};
