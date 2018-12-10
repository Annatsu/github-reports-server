// Repository Schema
const Repository = require('../../models/Repository');

// Controller behavior factories
const makeGetSingleRepository = require('./get_single_repository');
const makeGetRepositoriesByFilter = require('./get_repositories_by_filter');



/**
 * MongoDB strategy of getting a single repository by it's id.
 * 
 * @function mongoGetRepositoryById
 * 
 * @param {string} name - the name identifier of the repository to fetch.
 * 
 * @returns {(object|null)}
 */
const mongoGetRepositoryById =
    (id) => Repository.findById(id);



module.exports = {
    getSingleRepository: makeGetSingleRepository({ getRepoByIdStrategy: mongoGetRepositoryById }),
    getRepositories: makeGetRepositoriesByFilter(),

    // Include Factory Functions for testability purposes
    factories: {
        makeGetSingleRepository,
        makeGetRepositoriesByFilter,
    }
};
