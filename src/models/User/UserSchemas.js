const { z } = require('zod');

// TODO improve password validation
const SignUpValidationSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6).max(16),
  goal: z.enum(['Lose fat', 'Maintain', 'Gain Muscle']),
  gender: z.enum(['Male', 'Female']),
  age: z.number().int(),
  height: z.number().min(140).max(230),
  weight: z.number().min(40).max(170),
  physicalActivityRatio: z.number().min(1.2).max(2.5),
});

const SignInValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(16),
});

const UpdateUserValidationSchema = z
  .object({
    name: z.string().min(3).optional(),
    avatarURL: z.string().url().optional(),
    gender: z.enum(['Male', 'Female']).optional(),
    goal: z.enum(['Lose fat', 'Maintain', 'Gain Muscle']).optional(),
    age: z.number().int().optional(),
    weight: z.number().min(40).max(170).optional(),
    height: z.number().min(140).max(230).optional(),
    physicalActivityRatio: z.number().min(1.2).max(2.5).optional(),
  })
  .strict()
  .refine(obj => Object.keys(obj).length !== 0, 'Specify fields you want to update!');

const UpdateGoalValidationSchema = z
  .object({
    goal: z.enum(['Lose fat', 'Maintain', 'Gain Muscle']),
  })
  .strict();

const UpdateWeightValidationSchema = z
  .object({
    weight: z.number().min(40).max(170),
  })
  .strict();

const WatertValidationSchema = z
  .object({
    volume: z.number(),
  })
  .strict();

module.exports = {
  SignUpValidationSchema,
  SignInValidationSchema,
  UpdateUserValidationSchema,
  UpdateGoalValidationSchema,
  UpdateWeightValidationSchema,
  WatertValidationSchema,
};
