// Node Modules
const fastify = require('fastify')({
    logger: true,
    ignoreTrailingSlash: true,
});

// Fastify Plugins
const setupRoutes = require('./routes');

// Port to run the server.
const SERVER_PORT = process.env.port || 8080;



module.exports =
    () => {
        // Register the routes setup plugin.
        fastify.register(setupRoutes);

        // Start the Fastify API server.
        return fastify.listen(SERVER_PORT)
            .then(() => fastify.log.info(`Server running on port ${fastify.server.address().port}`))
            .catch((err) => {
                fastify.log.error(err);
                return err;
            });
    };
