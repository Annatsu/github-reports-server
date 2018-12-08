// Repository Schema
const Repository = require('../models/Repository');

// Response Errors
const {
    noError,
    repositoryNotFoundError
} = require('../constants/errors/repositories_error_objects');



/**
 * @typedef {object} makeGetSingleRepositoryDependencies
 * @property {function} getRepoByNameStrategy - a function that accepts a repository name and returns an object
 * with it's data if found, null otherwise.
 */



/**
 * Factory function to create a controller for fetching single repositories from the database.
 * 
 * @function makeGetSingleRepository
 * 
 * @param {makeGetSingleRepositoryDependencies} dependencies
 * 
 * @returns {function}
 */
const makeGetSingleRepository =
    ({ getRepoByNameStrategy }) => (req, res) => {
        const { repositoryName } = req.params;

        getRepoByNameStrategy(repositoryName)
            .then((repository) => {
                // If the repository was not found, return a 404 status code
                if (!repository)
                    return res.code(404).send({
                        ...repositoryNotFoundError,
                        data: null,
                    });

                // In case the repo was found, just return it without errors.
                res.code(200).send({
                    ...noError,
                    data: repository,
                });
            });
    };



const makeGetRepositories =
    () => (req, res) => {
        console.log('request params', req.query);

        res.code(200).send('Hello!');
    };



/**
 * MongoDB strategy of getting a single repository by it's name.
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
