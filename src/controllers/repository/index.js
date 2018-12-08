// Repository Schema
const Repository = require('../models/Repository');

// Controller behavior factories
const makeGetSingleRepository = require('./get_single_repository');
const makeGetRepositories = require('./get_repositories');



/**
 * MongoDB strategy of getting a single repository by it's name.
 * 
 * @function mongoGetRepositoryByName
 * 
 * @param {string} name - the name identifier of the repository to fetch.
 * 
 * @returns {(object|null)}
 */
const mongoGetRepositoryByName =
    (name) => Repository.findOne({ name });



module.exports = {
    getSingleRepository: makeGetSingleRepository({ getRepoByNameStrategy: mongoGetRepositoryByName }),
    getRepositories: makeGetRepositories(),

    // Include Factory Functions for testability purposes
    factories: {
        makeGetSingleRepository,
        makeGetRepositories,
    }
};
