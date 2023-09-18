const { handlerWrapper } = require('../helpers');
const UserModel = require('../models/User/UserModel');
const {
  UpdateGoalValidationSchema,
  UpdateUserValidationSchema,
  UpdateWeightValidationSchema,
} = require('../models/User/UserSchemas');

const statistics = async (req, res) => {
  // TODO calculate calories, water based on foodIntake
  const caloriesIntake = 2100;
  const waterIntake = 1200;

  res.json({ waterIntake, caloriesIntake, weight: req.user.weight });
};

const updateUserGoal = async (req, res) => {
  const validatedBody = UpdateGoalValidationSchema.parse(req.body);

  const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, { new: true });

  res.json({ goal: updatedUser.goal });
};

const updateUserWeight = async (req, res) => {
  const validatedBody = UpdateWeightValidationSchema.parse(req.body);

  const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, { new: true });

  res.json({ weight: updatedUser.weight });
};

module.exports = {
  statistics: handlerWrapper(statistics),
  updateUserGoal: handlerWrapper(updateUserGoal),
  updateUserWeight: handlerWrapper(updateUserWeight),
};
