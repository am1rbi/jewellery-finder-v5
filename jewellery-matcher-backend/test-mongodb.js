require('dotenv').config();
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
console.log('Attempting to connect to MongoDB...');
console.log('Connection string (redacted):', uri.replace(/\/\/.*@/, '//****:****@'));

// Mongoose connection
mongoose.connect(uri)
  .then(async () => {
    console.log('Successfully connected to MongoDB with Mongoose');
    console.log('Connected to database:', mongoose.connection.db.databaseName);
    
    // Ping the database
    try {
      await mongoose.connection.db.command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (pingError) {
      console.error('Error pinging the database:', pingError);
    }

    // Close the Mongoose connection
    await mongoose.disconnect();
    console.log('Mongoose connection closed');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB with Mongoose:', err.message);
    console.error('Error name:', err.name);
    console.error('Error code:', err.code);
    console.error('Full error object:', JSON.stringify(err, null, 2));
  })
  .finally(() => {
    // Test with MongoClient
    const client = new MongoClient(uri);

    client.connect()
      .then(async () => {
        console.log("Connected successfully to MongoDB with MongoClient");
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment with MongoClient. Connection confirmed!");
      })
      .catch(err => {
        console.error('Error connecting with MongoClient:', err);
      })
      .finally(async () => {
        await client.close();
        console.log('MongoClient connection closed');
        process.exit(0);
      });
  });