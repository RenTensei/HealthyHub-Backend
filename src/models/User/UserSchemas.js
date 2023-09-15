const { z } = require('zod');

const SignUpValidationSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(5),
  goal: z.enum(['Lose fat', 'Maintain', 'Gain Muscle']),
  gender: z.enum(['Male', 'Female']),
  age: z.number().int(),
  height: z.number().min(140).max(230),
  weight: z.number().min(40).max(170),
  physicalActivityRatio: z.number().min(1.2).max(2.5),
});

const SignInValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

const UpdateUserValidationSchema = z
  .object({
    name: z.string().min(3).optional(),
    gender: z.enum(['Male', 'Female']).optional(),
    age: z.number().int().optional(),
    height: z.number().min(140).max(230).optional(),
    physicalActivityRatio: z.number().min(1.2).max(2.5).optional(),
  })
  .strict()
  .refine(obj => Object.keys(obj).length !== 0, 'Specify fields you want to update!');

module.exports = { SignUpValidationSchema, SignInValidationSchema, UpdateUserValidationSchema };
