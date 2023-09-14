require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./app');

const { MONGO_CONNECTION_STRING, API_PORT } = process.env;

mongoose
  .connect(MONGO_CONNECTION_STRING)
  .then(() => {
    app.listen(API_PORT, () => {
      console.log('Database connection successful');
      console.log(`Server running. Use our API on port: ${API_PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
