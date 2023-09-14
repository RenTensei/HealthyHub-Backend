const bcrypt = require('bcryptjs');

const { handlerWrapper, HttpError } = require('../helpers');
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

const signIn = async () => {};

module.exports = {
  signUp: handlerWrapper(signUp),
  signIn: handlerWrapper(signIn),
};
