const { handlerWrapper } = require('../helpers');
const WaterIntakeModel = require('../models/WaterIntake/WaterIntakeModel');
const { SaveWaterIntakeValidationSchema } = require('../models/WaterIntake/WaterIntakeSchema');

const createDrink = async (req, res) => {
  const validatedBody = SaveWaterIntakeValidationSchema.parse(req.body);

  const createdWaterIntake = await WaterIntakeModel.create({
    ...validatedBody,
    consumer: req.user._id,
  });

  res.json(createdWaterIntake);
};

const getDiaryWater = async (req, res) => {
  const currentData = new Date();
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
  // const todayEnd = new Date(new Date().setHours(23, 59, 59, 999));

  const result = await WaterIntakeModel.find({
    consumer: req.user._id,
    createdAt: {
      $gte: todayStart,
      $lte: currentData,
      // $lte: todayEnd,
    },
  }).exec();

  res.json(result);
};

module.exports = {
  createDrink: handlerWrapper(createDrink),
  getDiaryWater: handlerWrapper(getDiaryWater),
};
