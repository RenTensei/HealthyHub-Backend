const { z } = require('zod');

const UserValidationSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

module.exports = { UserValidationSchema };
