const { z } = require('zod');

const SaveWaterIntakeValidationSchema = z
  .object({
    volume: z.number().min(0),
  })
  .strict();

module.exports = { SaveWaterIntakeValidationSchema };
