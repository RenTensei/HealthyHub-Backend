const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { handlerWrapper, HttpError, envVars } = require('../helpers');
const UserModel = require('../models/User/UserModel');
const { UserValidationSchema } = require('../models/User/UserSchemas');

const signUp = async (req, res) => {
  const validatedBody = UserValidationSchema.parse(req.body);

  const existingUserEmail = await UserModel.findOne({
    email: validatedBody.email,
  });
  if (existingUserEmail) throw new HttpError('409', 'Email already in use!');

  const hashedPassword = await bcrypt.hash(validatedBody.password, 10);

  const newUser = await UserModel.create({
    email: validatedBody.email,
    password: hashedPassword,
  });

  res.status(201).json({
    user: { email: newUser.email },
  });
};

const signIn = async (req, res) => {
  const validatedBody = UserValidationSchema.parse(req.body);

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
      email: updatedUser.email,
    },
  });
};

const current = async (req, res) => {
  res.json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
};

module.exports = {
  signUp: handlerWrapper(signUp),
  signIn: handlerWrapper(signIn),
  current: handlerWrapper(current),
};