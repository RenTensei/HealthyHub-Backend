const { z } = require('zod');

const SaveFoodIntakeValidationSchema = z
  .object({
    mealName: z.string().nonempty(),
    mealType: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack']),
    carbohydrates: z.number().min(0),
    protein: z.number().min(0),
    fat: z.number().min(0),
    calories: z.number().min(0),
  })
  .strict();

module.exports = { SaveFoodIntakeValidationSchema };
