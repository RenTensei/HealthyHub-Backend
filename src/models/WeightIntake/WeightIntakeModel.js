const { model, Schema } = require('mongoose');

const weightIntakeSchema = new Schema(
  {
    weight: {
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

const WeightIntakeModel = model('WeightIntake', weightIntakeSchema);

module.exports = WeightIntakeModel;
