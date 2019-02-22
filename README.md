# github-reports-server


## What is this?

This application is used to demonstrate some core concepts about building a server API and making queries.

When booted up, it fetches, modify and store 1000 or more records of Github repositories into the server and make them available through two API endpoints described down below.


## How can i install and run it on my machine?

Simple enough. You just need to have MongoDB installed!

Just clone this repository into your computer and follow some steps.
```bash
git clone https://github.com/annatsu/github-reports-server
cd github-reports-server
npm install
```

Ok, so you cloned the repository and installed it's dependencies. Now, all you need to do is create an OAuth token.

Go to [your Personal Access Token](https://github.com/settings/tokens) page and click on **Generate new token**. It doesn't need any specific permission, so just give it a name and generate it.

Now, with your token in hands, replace the `YOUR_OAUTH_TOKEN_HERE` in the file [`nodemon.json`](./nodemon.json) with your token.

That's it. You're ready to go. Just run the command below and it will start.
```bash
npm start
```


## What libraries/frameworks are used?

[Fastify](https://fastify.io) is used for creating a server and an API, since it is a highly performant and customizable option for building fast applications with NodeJS.

As for the database, [MongoDB](https://www.mongodb.com/) with [mongoose](https://mongoosejs.com) is the selected one, but for better implementations, facade pattern plus dependency injection would be a good bet.

[Axios](https://github.com/axios/axios) is also used for data fetching from Github and [escape-string-regexp](https://github.com/sindresorhus/escape-string-regexp) for database searching.


## Which endpoints are available?

| URL                         | HTTP Method | Description                                                                                                                                                |
|-----------------------------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/repositories/`            | GET         | Return an array with a list of all the repositories stored in the database.                                                                                |
| `/repository/:repositoryId` | GET         | Return a single repository if found, or a 404 status with an error message if not. `:repositoryId` must be a valid `_id` property of a fetched repository. |


#### Examples

**Request:**

`/repository/5c0e50e865fb352d7a013056`

**Response:**
```javascript
{
   "error":false,
   "errorMessage":"",
   "data":{
      "languages":[
         "Ruby"
      ],
      "watchers":[

      ],
      "_id":"5c0e50e865fb352d7a013056",
      "owner":"mojombo",
      "name":"grit",
      "description":"**Grit is no longer maintained. Check out libgit2/rugged.** Grit gives you object oriented read/write access to Git repositories via Ruby.",
      "watchersCount":1877,
      "languagesCount":1,
      "stars":1877,
      "forks":479,
      "__v":0
   }
}
```

**Request:**

`/repositories?maxResults=2&languages=Javascript,C++`

**Response:**
```javascript
[
   {
      "languages":[
         "JavaScript"
      ],
      "watchers":[

      ],
      "_id":"5c0e50e865fb352d7a0133ed",
      "owner":"spiegela",
      "name":"active_scaffold_extjs_sample_app",
      "description":"Sample Application for use while I'm writing the active_scaffold_extjs bridge and front end",
      "watchersCount":8,
      "languagesCount":1,
      "stars":8,
      "forks":0,
      "__v":0
   },
   {
      "languages":[
         "JavaScript"
      ],
      "watchers":[

      ],
      "_id":"5c0e50e865fb352d7a013420",
      "owner":"tarvaina",
      "name":"agile-web-development-slides",
      "description":"Slides for the Active Web Development course in Tampere University of Technology",
      "watchersCount":1,
      "languagesCount":1,
      "stars":1,
      "forks":0,
      "__v":0
   }
]
```


## Are there any querying parameters for searching?

Yes there are!

Since the only needed param for the `/repository` endpoint is a valid document id, all of the query options listed below are to be used in the `/repositories` endpoint.

| Parameter | Type | Description | Example |
|---------------------------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| *name* | string | Find repositories that contain the given name. | `?name=github-search-server` |
| *maxResults* | integer | The maximum limit of repositories to be returned from the API. | `?maxResults=42` |
| *author* | string | Only get the repositories from a specific owner. | `?author=annatsu` |
| *languages* | string | A list of languages, separated by commas. The search will be made inclusively, returning any repository with at least one of the provided languages. | `?languages=javascript,C++` |
| ~~*watchers*~~ | string | A list of watchers, separated by commas. The search will be made inclusively, returning any repository with at least one of the provided watcher usernames. | `?watchers=annatsu,qu4dratus` |
| *order* | string | this can either be set to `asc` or `des`, to retrieve the upper results or the bottom ones. | `?order=asc`,  `order=des` |
| *minStars* & *maxStars* | number | Range query conditions. They can be used together or separately. Define the number of stars a repository must have to be returned. | `?minStars=12& maxStars=100`,  `?minStars=1`,  `?maxStars=10` |
| *minWatchers* & *maxWatchers* | number | Range query conditions. They can be used together or separately. Define the number of watchers a repository must have to be returned. | `?minWatchers=12& maxWatchers=100`,  `?minWatchers=1`,  `?maxWatchers=10` |
| *minLanguages* & *maxLanguages* | number | Range query conditions. They can be used together or separately. Define the number of languages used a repository must have to be returned. | `?minLanguages=12& maxLanguages=100`,  `?minLanguages=1`,  `?maxLanguages=10` |
| *minForks* & *maxForks* | number | Range query conditions. They can be used together or separately. Define the number of forks a repository must have to be returned. | `?minForks=12& maxForks=100`,  `?minForks=1`,  `?maxForks=10` |

The `watchers` param is striked for a reason. The Github API only lets some thousands of requests in, and, as far as implementation goes, if we were to fetch the repository, languages and watchers, there would be a minimum of 3000 requests. This would most probably make your *OAUTH* token blocked for an hour, which is not good. So, the code is there, we just don't fetch it.


## Future Implementation Checklist

- [ ] Use dependency injection with a facade for the multiple filter endpoint controller, just like the more simpler, find by id endpoint.
- [ ] Write unit test for the controllers.
- [ ] As of now, every repository stored has an array of languages of size 1. This is because we would have to, once again, multiply the number of requests by `1000`. It would be better to do this without the risk of getting the *OAUTH* token blocked.
- [ ] Write a frontend UI to mess around with querying and displaying repositories. Also, to display a lot of sliders; who doesn't love sliders?
- [ ] Create a database singleton and inject it in everything that needs interaction with the database as a facade. This would abstract database interaction and make the app more scalable and mantainable.
- [ ] [`/src/controllers/repository/get_repositories_by_filter.js`](./src/controllers/repository/get_repositories_by_filter.js) can be functional, well structured and modularized. But, please, document it.
