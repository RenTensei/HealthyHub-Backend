const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { handlerWrapper, HttpError, envVars } = require('../helpers');
const UserModel = require('../models/User/UserModel');
const { SignUpValidationSchema, SignInValidationSchema } = require('../models/User/UserSchemas');

const signUp = async (req, res) => {
  const validatedBody = SignUpValidationSchema.parse(req.body);

  const existingUserEmail = await UserModel.findOne({ email: validatedBody.email });
  if (existingUserEmail) throw new HttpError(409, 'Email already in use!');

  const hashedPassword = await bcrypt.hash(validatedBody.password, 10);

  const newUser = await UserModel.create({
    ...validatedBody,
    password: hashedPassword,
  });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      goal: newUser.goal,
      gender: newUser.gender,
      age: newUser.age,
      height: newUser.height,
      weight: newUser.weight,
      physicalActivityRatio: newUser.physicalActivityRatio,
      BMR: newUser.BMR,
    },
  });
};

const signIn = async (req, res) => {
  const validatedBody = SignInValidationSchema.parse(req.body);

  const existingUser = await UserModel.findOne({ email: validatedBody.email });
  if (!existingUser) throw new HttpError(401, 'Email or password is wrong!');

  const passwordMatch = bcrypt.compareSync(validatedBody.password, existingUser.password);
  if (!passwordMatch) throw new HttpError(401, 'Email or password is wrong');

  const token = jwt.sign({ id: existingUser._id }, envVars.JWT_SECRET, {
    expiresIn: '24h',
  });
  const updatedUser = await UserModel.findByIdAndUpdate(existingUser._id, { token }, { new: true });

  res.json({
    token: updatedUser.token,
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      goal: updatedUser.goal,
      gender: updatedUser.gender,
      age: updatedUser.age,
      height: updatedUser.height,
      weight: updatedUser.weight,
      physicalActivityRatio: updatedUser.physicalActivityRatio,
      BMR: updatedUser.BMR,
    },
  });
};

const current = async (req, res) => {
  const { name, email, goal, gender, age, height, weight, physicalActivityRatio, BMR } = req.user;
  res.json({
    name,
    email,
    goal,
    gender,
    age,
    height,
    weight,
    physicalActivityRatio,
    BMR,
  });
};

module.exports = {
  signUp: handlerWrapper(signUp),
  signIn: handlerWrapper(signIn),
  current: handlerWrapper(current),
};
