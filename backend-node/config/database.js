const mongoose = require('mongoose');

const connectDatabase = async () => {

  try {

    const mongoUrl = process.env.MONGO_URL;
    const dbName = process.env.DB_NAME;

    const conn = await mongoose.connect(
      `${mongoUrl}/${dbName}`
    );

    console.log(
      `MongoDB Connected: ${conn.connection.host}`
    );

  } catch (error) {

    console.error(
      'MongoDB connection error:',
      error.message
    );

    process.exit(1);
  }
};

module.exports = connectDatabase;