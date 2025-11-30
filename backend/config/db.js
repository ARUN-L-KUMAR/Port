const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'Port';

let client;
let db;
let isConnected = false;

async function connectToDatabase() {
  try {
    if (!mongoUrl.includes('mongodb://') && !mongoUrl.includes('mongodb+srv://')) {
      console.log('No valid MongoDB URL provided. Running without database.');
      return null;
    }

    client = new MongoClient(mongoUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 15000, // 15 seconds
      serverSelectionTimeoutMS: 15000, // 15 seconds
    });

    console.log('🔄 Connecting to MongoDB Atlas...');
    await client.connect();
    
    // Use the database name from environment or default
    db = client.db(dbName);
    
    // Test the connection
    await db.command({ ping: 1 });
    
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully!');
    console.log(`📁 Database: ${dbName}`);
    return db;
  } catch (error) {
    console.log('⚠️  MongoDB Atlas connection failed:', error.message);
    console.log('   - Check your internet connection');
    console.log('   - Verify your MongoDB Atlas credentials');
    console.log('   - Ensure IP address is whitelisted');
    console.log('   - Backend will run with fallback data');
    isConnected = false;
    return null;
  }
}

function getDatabase() {
  if (!isConnected || !db) {
    console.log('Database not connected, using fallback data');
    return null;
  }
  return db;
}

function isDatabaseConnected() {
  return isConnected;
}

module.exports = {
  connectToDatabase,
  getDatabase,
  isDatabaseConnected,
  client
};