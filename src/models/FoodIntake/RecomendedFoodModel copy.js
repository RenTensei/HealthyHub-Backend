const { model, Schema } = require('mongoose');
const { string } = require('zod');

const RecomendedFoodSchema = new Schema({
  RecommendedFood: { type: String },
  amount: { type: String },
  img: { type: String },
  calories: { type: Number },
  carbohydrates: { type: Number },
  protein: { type: Number },
  fat: { type: Number },
});

const FoodAllModel = model('Recommendedfood', RecomendedFoodSchema);

module.exports = FoodAllModel;
