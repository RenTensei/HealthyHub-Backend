const { handlerWrapper } = require('../helpers');
const FoodIntakeModel = require('../models/FoodIntake/FoodIntakeModel');
const UserModel = require('../models/User/UserModel');
const { UpdateUserValidationSchema } = require('../models/User/UserSchemas');
const WaterIntakeModel = require('../models/WaterIntake/WaterIntakeModel');
const WeightIntakeModel = require('../models/WeightIntake/WeightIntakeModel');
const calculateBMR = require('../utils/calculateBMR');
const extractUpdatedFields = require('../utils/extractUpdatedFields');
const parseStringPropsToNums = require('../utils/parseStringPropsToNums');

const statistics = async (req, res) => {
  // TODO calculate calories, water based on foodIntake
  // Time endpoints
  // __________________________________________________________
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
  // _______________________________

  const { range } = req.query;
  if (!range) {
    const amountWater = await WaterIntakeModel.aggregate([
      {
        $match: {
          consumer: req.user._id,
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$createdAt' },
          },
          total: { $sum: '$volume' },
          // count: { $count: 1 },
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
          _id: {
            day: { $dayOfMonth: '$createdAt' },
          },
          total: { $sum: '$calories' },
        },
      },
    ]);

    const waterIntake = amountWater.length === 0 ? 0 : amountWater[0].total;
    const caloriesIntake = amountCalories.length === 0 ? 0 : amountCalories[0].total;

    res.json({
      water: waterIntake,
      calories: caloriesIntake,
      weight: req.user.weight,
    });
  } else if (range === 'month') {
    startDate = beforeMonth;
    // get to Month
    const water = await WaterIntakeModel.aggregate([
      {
        $match: {
          consumer: req.user._id,
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          water: { $sum: '$volume' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const calories = await FoodIntakeModel.aggregate([
      {
        $match: {
          consumer: req.user._id,
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          calories: { $sum: '$calories' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const weight = await WeightIntakeModel.aggregate([
      {
        $match: {
          consumer: req.user._id,
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          weight: { $sum: '$weight' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      water,
      calories,
      weight,
    });
  } else if (range === 'year') {
    startDate = beforeYear;
    // get to Year
    const water = await WaterIntakeModel.aggregate([
      {
        $match: {
          consumer: req.user._id,
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          totalDay: { $sum: '$volume' },
        },
      },
      { $sort: { _id: 1 } },
      {
        $group: {
          _id: {
            year: '$_id.year',
            month: '$_id.month',
          },
          avgMonth: { $avg: '$totalDay' },
        },
      },

      { $sort: { _id: 1 } },
    ]);
    const calories = await FoodIntakeModel.aggregate([
      {
        $match: {
          consumer: req.user._id,
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          totalDay: { $sum: '$calories' },
        },
      },
      { $sort: { _id: 1 } },
      {
        $group: {
          _id: {
            year: '$_id.year',
            month: '$_id.month',
          },
          avgMonth: { $avg: '$totalDay' },
        },
      },

      { $sort: { _id: 1 } },
    ]);
    const weight = await WeightIntakeModel.aggregate([
      {
        $match: {
          consumer: req.user._id,
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          totalDay: { $sum: '$weight' },
        },
      },
      { $sort: { _id: 1 } },
      {
        $group: {
          _id: {
            year: '$_id.year',
            month: '$_id.month',
          },
          avgMonth: { $avg: '$totalDay' },
        },
      },

      { $sort: { _id: 1 } },
    ]);
    res.json({
      water,
      calories,
      weight,
    });
  }
};

const updateUser = async (req, res) => {
  // parseStringPropsToNums чтоб спарсить числа из стринговых значений (FormData)
  const parsedBody = parseStringPropsToNums(req.body);
  if (req.file && req.file.path) Object.assign(parsedBody, { avatarURL: req.file.path });

  console.log(parsedBody);

  const validatedBody = UpdateUserValidationSchema.parse(parsedBody);

  const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, { new: true });

  const { gender, height, weight, age, physicalActivityRatio } = updatedUser;
  validatedBody.BMR = calculateBMR({ gender, height, weight, age, physicalActivityRatio });

  const updatedBMRUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, {
    new: true,
  });
  const updatedFields = extractUpdatedFields(validatedBody, updatedBMRUser);

  res.json(updatedFields);
};

// const updateUserGoal = async (req, res) => {
//   const validatedBody = UpdateGoalValidationSchema.parse(req.body);

//   const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, { new: true });

//   const { gender, height, weight, age, physicalActivityRatio } = updatedUser;
//   validatedBody.BMR = calculateBMR({ gender, height, weight, age, physicalActivityRatio });

//   const updatedBMRUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, {
//     new: true,
//   });

//   extractUpdatedFields(validatedBody, updatedBMRUser);
//   res.json({ goal: updatedUser.goal });
// };

// const updateUserWeight = async (req, res) => {
//   const validatedBody = UpdateWeightValidationSchema.parse(req.body);

//   const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, { new: true });

//   const { gender, height, weight, age, physicalActivityRatio } = updatedUser;
//   validatedBody.BMR = calculateBMR({ gender, height, weight, age, physicalActivityRatio });

//   const updatedBMRUser = await UserModel.findByIdAndUpdate(req.user._id, validatedBody, {
//     new: true,
//   });
//   //_________________________
//   const currentData = new Date();
//   const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
//   //-------------------------

//   const todayWeight = await WeightIntakeModel.aggregate([
//     {
//       $match: {
//         consumer: req.user._id,
//         createdAt: { $gte: todayStart, $lt: currentData },
//       },
//     },
//   ]);

//   if (todayWeight.length === 0) {
//     await WeightIntakeModel.create({
//       weight: updatedBMRUser.weight,
//       consumer: req.user._id,
//     });
//   } else {
//     await WeightIntakeModel.findOneAndUpdate(
//       todayWeight[0]._id,
//       { weight: updatedBMRUser.weight },
//       { new: true }
//     );
//   }

//   extractUpdatedFields(validatedBody, updatedBMRUser);
//   res.json({
//     weight: updatedBMRUser.weight,
//   });
// };

module.exports = {
  statistics: handlerWrapper(statistics),
  updateUser: handlerWrapper(updateUser),
  // updateUserGoal: handlerWrapper(updateUserGoal),
  // updateUserWeight: handlerWrapper(updateUserWeight),
};
