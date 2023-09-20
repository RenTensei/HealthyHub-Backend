const { model, Schema } = require('mongoose');

const waterIntakeSchema = new Schema(
  {
    volume: {
      type: Number,
      required: true,
    },
    consumer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const WaterIntakeModel = model('WaterIntake', waterIntakeSchema);

module.exports = WaterIntakeModel;
