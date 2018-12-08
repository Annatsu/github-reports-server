// Node Modules
const mongoose = require('mongoose');


// The location path of the database.
const DATABASE_URL = 'mongodb://localhost/github-search-db';



module.exports =
    () => {
        // Connect to DB
        return mongoose.connect(DATABASE_URL)
            .then(() => console.log('MongoDB connected…'));
    };
