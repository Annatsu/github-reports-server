# github-reports-server


## What is this?

This application is used to demonstrate some core concepts about building a server API and making queries.

When booted up, it fetches, modify and store 1000 records of Github repositories into the server and make them available through two API endpoints described below.


## What libraries/frameworks are used?

[Fastify](https://fastify.io) is used for creating a server and an API, since it is a highly performant and customizable option for building fast applications with NodeJS.

As for the database, [MongoDB]() with [mongoose](https://mongoosejs.com) is the selected one, but for better implementations, facade pattern plus dependency injection would be a good bet.

[Axios]() is also used for data fetching from Github and [escape-string-regexp]() for database searching.


## Which endpoints are available?

`/repositories`

`/repository/:repositoryId`


## Implementation Checklist

- [ ] Use dependency injection with a facade for the multiple filter endpoint controller, just like the more simpler, find by id endpoint.
- [ ] Write unit test for the controllers.
- [ ] 
