const mongoose = require('mongoose');
require('dotenv').config()
const ConnectToMongoose = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            //   useNewUrlParser: true,
            //   useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
};

module.exports = ConnectToMongoose;