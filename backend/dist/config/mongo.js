"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollection = exports.getDB = exports.closeMongoDB = exports.connectMongoDB = void 0;
const mongodb_1 = require("mongodb");
const env_1 = require("./env");
let client = null;
let db = null;
const options = {
    maxPoolSize: 20,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};
const connectMongoDB = async () => {
    try {
        const uri = env_1.env.MONGO_URI;
        client = new mongodb_1.MongoClient(uri, options);
        await client.connect();
        db = client.db();
        console.log('Connected to MongoDB');
        return db;
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};
exports.connectMongoDB = connectMongoDB;
const closeMongoDB = async () => {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
};
exports.closeMongoDB = closeMongoDB;
const getDB = () => {
    if (!db) {
        throw new Error('MongoDB not connected. Call connectMongoDB first.');
    }
    return db;
};
exports.getDB = getDB;
const getCollection = (name) => {
    return (0, exports.getDB)().collection(name);
};
exports.getCollection = getCollection;
