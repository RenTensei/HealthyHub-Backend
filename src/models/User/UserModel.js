const { Schema, model } = require('mongoose');

const calculateBMR = require('../../utils/calculateBMR');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
      enum: ['Lose fat', 'Maintain', 'Gain Muscle'],
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    physicalActivityRatio: {
      type: Number,
      required: true,
      min: 1.2,
      max: 2.5,
    },
    BMR: {
      type: Number,
    },
  },
  { versionKey: false, timestamps: true }
);

// если поля обновляются, БМР обновляется автоматически
userSchema.pre('save', function (next) {
  const { goal, gender, height, weight, age, physicalActivityRatio, BMR } = this;
  this.BMR = calculateBMR({ goal, gender, height, weight, age, physicalActivityRatio });
  next();
});

const UserModel = model('User', userSchema);

module.exports = UserModel;
