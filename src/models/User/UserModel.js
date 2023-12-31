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
      default:
        'https://res.cloudinary.com/dz8c8nfqr/image/upload/v1695548987/healthuhub-avatars/default-avatar_jfpabp.jpg',
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
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// если поля обновляются, БМР обновляется автоматически
userSchema.pre('save', function (next) {
  const { gender, height, weight, age, physicalActivityRatio } = this;
  this.BMR = calculateBMR({ gender, height, weight, age, physicalActivityRatio });
  next();
});

const UserModel = model('User', userSchema);

module.exports = UserModel;
