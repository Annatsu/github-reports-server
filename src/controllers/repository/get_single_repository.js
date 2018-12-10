const {
    noError,
    repositoryNotFoundError,
} = require('../../constants/errors/repositories_error_objects');


/**
 * @typedef {object} makeGetSingleRepositoryDependencies
 * @property {function} getRepoByIdStrategy - a function that accepts a repository id and returns an object
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
    ({ getRepoByIdStrategy }) => (req, res) => {
        const { repositoryId } = req.params;

        getRepoByIdStrategy(repositoryId)
            .then((repository) => {
                if (!repository)
                    res.code(404).send(repositoryNotFoundPayload);
                else
                    res.code(200).send(makeSuccessPayload(repository));
            })
            .catch((err) => {
                console.error(err);
                res.code(500).send({
                    error: true,
                    errorMessage: err,
                });
            });
    };



/**
 * When no repository could be fetched from the database,
 * return a default payload.
 */
const repositoryNotFoundPayload = {
    ...repositoryNotFoundError,
    data: null,
};



/**
 * When a repository has been successfully retrieved from the DB, create a payload with it.
 * 
 * @function makeSuccessPayload
 * 
 * @param {object} data - data to be added to the success payload
 * 
 * @return {object}
 */
const makeSuccessPayload =
    (data) => ({
        ...noError,
        data,
    });



module.exports = makeGetSingleRepository;
