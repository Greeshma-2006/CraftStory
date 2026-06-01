const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {

    // MONGO_URL in .env already contains the database name and query params
    // e.g. mongodb+srv://user:pass@cluster.mongodb.net/CraftStory?retryWrites=true&w=majority
    // Do NOT append DB_NAME again — it would make the URL malformed
    const mongoUrl = process.env.MONGO_URL;

    await mongoose.connect(mongoUrl, {

      // How long (ms) the driver waits to find an available server.
      // Default is 30 000 ms — on Render this causes requests to hang for
      // 30 seconds before returning a timeout error.
      // Set to 10 s so failures are reported quickly.
      serverSelectionTimeoutMS: 10000,

      // How long a single socket is allowed to stay idle before closing.
      socketTimeoutMS: 45000,

      // Max connection pool size — fine for hobby/starter plans.
      maxPoolSize: 10,
    });

    console.log(`MongoDB Connected: ${mongoose.connection.host}`);

  } catch (error) {

    console.error('MongoDB connection error:', error.message);

    // Exit so the process manager (Render) restarts the service
    process.exit(1);
  }
};

module.exports = connectDatabase;
