require('dotenv').config();
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_STRING;


const connectDB = () => {
    mongoose.connect(MONGO_URI);
    const database = mongoose.connection;

    database.on('error', (error) => {
        console.error(error);
        console.log(error);
    });

    database.once('connected', () => {
        console.log('Database Connected');
    });
};


module.exports = connectDB;