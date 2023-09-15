const extractUpdatedFields = (validatedBody, updatedUser) =>
  Object.keys(validatedBody).reduce((acc, key) => {
    if (key in updatedUser) {
      acc[key] = updatedUser[key];
    }
    return acc;
  }, {});

module.exports = extractUpdatedFields;
