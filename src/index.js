require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./app');
const { envVars } = require('./helpers');

mongoose
  .connect(envVars.MONGO_CONNECTION_STRING)
  .then(() => {
    app.listen(envVars.API_PORT, () => {
      console.log('Database connection successful');
      console.log(`Server running. Use our API on port: ${envVars.API_PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
