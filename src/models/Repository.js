// Node Modules
const mongoose = require('mongoose');


// Define the repository schema.
const repositorySchema = new mongoose.Schema({
    owner: String,
    name: String,
    description: String,
    languages: [String],
    watchers: [String],
    languagesCount: Number,
    watchersCount: Number,
    stars: Number,
    forks: Number,
});



// Export the repository mongoose model.
module.exports = mongoose.model('Repository', repositorySchema);
