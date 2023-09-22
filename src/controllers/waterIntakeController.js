const { handlerWrapper } = require('../helpers');
const { WatertValidationSchema } = require('../models/User/UserSchemas');
const WaterIntakeModel = require('../models/WaterIntake/WaterIntakeModel');

const createDrink = async (req, res) => {
  const validatedBody = WatertValidationSchema.parse(req.body);

  const createdWaterIntake = await WaterIntakeModel.create({
    ...validatedBody,
    consumer: req.user._id,
  });

  res.json(createdWaterIntake);
};

module.exports = {
  createDrink: handlerWrapper(createDrink),
};
