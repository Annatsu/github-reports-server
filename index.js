// Application Dependencies
const startServer = require('./src/server');
const startDatabase = require('./src/database');



// Starts the server and the database.
(async () => {
    try {
        startDatabase();
        startServer();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
