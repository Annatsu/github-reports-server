
/**
 * Appended to the payload response when an user requests for a repository
 * that is not stored in the database.
 * 
 * @name repositoryNotFoundError
 **/
const repositoryNotFoundError = {
    error: true,
    errorMessage: 'Repository not found!',
};


/**
 * Appended to the payload response when the user made a successful request.
 */
const noError = {
    error: false,
    errorMessage: '',
};



module.exports = {
    repositoryNotFoundError,
    noError,
};
