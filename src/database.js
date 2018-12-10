// Node Modules
const mongoose = require('mongoose');
const axios = require('axios');

// Repository Model
const Repository = require('./models/Repository');


// The location path of the database.
const DATABASE_URL = 'mongodb://localhost/github-search-db';



module.exports =
    () => new Promise((resolve, reject) => {
        // Connect to DB
        mongoose.connect(DATABASE_URL)
            .then(async () => {
                console.log('MongoDB connected…')

                // Count the number of existing repositories.
                // If the list of repos is not populated with, at least, 1000 documents
                // populate it.
                const documentsCount = Repository.countDocuments();
                if (documentsCount >= 1000)
                    return resolve();


                await Repository.deleteMany({});

                const repos = await fetchRepositories();
                await Repository.insertMany(repos);

                resolve();
            })
            .catch(reject);
    });



const fetchRepositories =
    async (since, count = 0) => {
        console.log(`${count / 10}% - Fetching repositories`);

        if (parseInt(count, 10) >= 1000)
            return [];

        const queryParam = since ? `?since=${since}` : '';
        const { data } = await axios.get(`https://api.github.com/repositories${queryParam}`);
        const lastRepo = data[data.length - 1];

        console.log('data', data)

        const fetchReposPromises = data.map((repo) => fetchSingleRepository(repo.full_name));
        const sanitizedRepositories = await Promise.all(fetchReposPromises).then(sanitizeRepositoryList);

        return sanitizedRepositories.concat(await fetchRepositories(lastRepo.id, count + 100));
    };



const fetchSingleRepository =
    (repositoryName) => {
        return axios.get(`https://api.github.com/repos/${repositoryName}`)
            .then(({ data: repositoryData }) => {
                return axios.get(repositoryData.languages_url)
                    .then(({ data: languagesData }) => {
                        repositoryData.languagesArray = Object.keys(languagesData);
                        return repositoryData;
                    });
            });
    };

const sanitizeRepositoryList =
    (repositories) => repositories.map((repo) => sanitizeRepositoryObject(repo));



const sanitizeRepositoryObject =
    (repositoryObject) => ({
        owner: repositoryObject.owner.login,
        name: repositoryObject.name,
        description: repositoryObject.description,
        languages: repositoryObject.languagesArray,
        watchersCount: repositoryObject.watchers_count,
        languagesCount: repositoryObject.languagesArray.length,
        stars: repositoryObject.stargazers_count,
        forks: repositoryObject.forks_count
    });
