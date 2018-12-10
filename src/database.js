// Node Modules
const mongoose = require('mongoose');
const axios = require('axios');

// Repository Model
const Repository = require('./models/Repository');


// The location path of the database.
const DATABASE_URL = 'mongodb://localhost/github-search-db';

// API token secret.
const OAUTH_TOKEN = process.env.OAUTH_TOKEN;



module.exports =
    () => new Promise((resolve, reject) => {
        // Connect to DB
        mongoose.connect(DATABASE_URL)
            .then(async () => {
                console.log('MongoDB connected…');

                // Count the number of existing repositories.
                // If the list of repos is not populated with, at least, 1000 documents
                // populate it.
                const documentsCount = await Repository.countDocuments();
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
        console.log(`Fetched ${count} repositories...`);

        if (parseInt(count, 10) >= 1000)
            return [];

        const queryParam = `?access_token=${OAUTH_TOKEN}` + (since ? `&since=${since}` : '');
        const { data } = await axios.get(`https://api.github.com/repositories${queryParam}`);
        const lastRepo = data[data.length - 1];

        const fetchRepositoriesPromises = data.map((repo) => fetchSingleRepository(repo.full_name));
        const repositories = await Promise.all(fetchRepositoriesPromises)
            .then((repositories) => repositories.filter(Boolean))
            .then((repositories) => repositories.map(sanitizeRepositoryObject));

        return repositories.concat(await fetchRepositories(lastRepo.id, count + repositories.length));
    };



const fetchSingleRepository =
    async (repositoryName) => {
        let returnVal = null;
        try {
            const res = await axios.get(`https://api.github.com/repos/${repositoryName}?access_token=${OAUTH_TOKEN}`);
            res.data.languagesArray = [res.data.language];
            returnVal = res.data;
        } catch (err) {
            console.error(err);
        }

        return returnVal;
    };



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
