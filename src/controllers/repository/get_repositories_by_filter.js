// Node Modules
const escapeString = require('escape-string-regexp');

// Repository Model
const Repository = require('../../models/Repository');



const DESCENDING_ORDER = 'des';




const makeGetRepositories =
    () => (req, res) => {
        const queryConditions = createQueryConditions(req.query);
        const queryOptions = createQueryOptions(req.query);


        console.log('query', req.query, queryConditions, queryOptions);


        Repository
            .find(queryConditions, null, queryOptions)
            .then((repoDocuments) => res.code(200).send(repoDocuments))
            .catch((err) => res.code(500).send(err));
    };




const makeQueryTranslatorFunction =
    (translatorObject) => (queryParams) => {
        return Object.entries(queryParams)
            .reduce((acc, [key, value]) => {
                if (key in translatorObject) {
                    const [optionKey, optionValue] = translatorObject[key](acc, value);
                    acc[optionKey] = optionValue;
                }

                return acc;
            }, {});
    };


const queryParamToArray =
    (queryParam) => String(queryParam).split(',').map((s) => new RegExp(`^${escapeString(s)}$`, 'i'));



const makeRangeCondition =
    (conditionName, rangeType) => (queryConditions, rangeParam) => {
        return [
            conditionName,
            {
                ...queryConditions[conditionName],
                [rangeType]: parseInt(rangeParam, 10)
            }
        ];
    };

const makeArrayContainCondition =
    (conditionName) => (_, stringParam) => {
        return [conditionName, { $in: queryParamToArray(stringParam) }];
    };


const queryConditionTranslators = {
    name: (_, repoName) =>
        ['name', new RegExp(escapeString(repoName), 'i')],

    languages: makeArrayContainCondition('languages'),
    watchers: makeArrayContainCondition('watchers'),

    minStars: makeRangeCondition('stars', '$gte'),
    maxStars: makeRangeCondition('stars', '$lte'),

    minForks: makeRangeCondition('forks', '$gte'),
    maxForks: makeRangeCondition('forks', '$lte'),

    minLanguages: makeRangeCondition('languagesCount', '$gte'),
    maxLanguages: makeRangeCondition('languagesCount', '$lte'),

    minWatchers: makeRangeCondition('watchersCount', '$gte'),
    maxWatchers: makeRangeCondition('watchersCount', '$lte'),
};

const queryOptionTranslators = {
    order: (_, orderType) => {
        return [
            'sort',
            `${orderType === DESCENDING_ORDER ? '-' : ''}name`
        ];
    },
    maxResults: (_, maxResults) => ['limit', parseInt(maxResults, 10)]
};




const createQueryConditions = makeQueryTranslatorFunction(queryConditionTranslators);

const createQueryOptions =
    (queryParams) => {
        const queryOptions = makeQueryTranslatorFunction(queryOptionTranslators)(queryParams);

        if (!('sort' in queryOptions))
            queryOptions.sort = 'name';

        return queryOptions;
    };



module.exports = makeGetRepositories;
