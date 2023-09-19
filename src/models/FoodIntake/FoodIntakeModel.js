const { model, Schema } = require('mongoose');

const foodIntakeSchema = new Schema(
  {
    mealName: {
      type: String,
      required: true,
    },
    mealType: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
      required: true,
    },
    carbonohidrates: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number,
      required: true,
    },
    fat: {
      type: Number,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    consumer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { versionKey: false, timestamps: true }
);

const FoodIntakeModel = model('foodintakes', foodIntakeSchema);

module.exports = FoodIntakeModel;
