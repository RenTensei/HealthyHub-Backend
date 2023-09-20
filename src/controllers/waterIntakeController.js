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

module.exports = {
  createDrink: handlerWrapper(createDrink),
};
