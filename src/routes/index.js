module.exports =
    (fastify, _, next) => {
        // Register route controllers.
        fastify.register(require('./repositories'), { prefix: '/repositories' });
        fastify.register(require('./repository')), { prefix: '/repository' };

        next();
    };
