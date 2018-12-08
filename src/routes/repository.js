// Controllers
const repositoryController = require('../controllers/repository');



module.exports =
    (fastify, options, next) => {
        fastify.route({
            method: 'GET',
            url: '/:repositoryName',
            handler: repositoryController.getSingleRepository,
        });

        next();
    };
