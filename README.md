# Northcoders News API

This is the back-end project I completed as part of my Northcoders bootcamp. It serves as the backend API for a Reddit-style web application, and allows users to interact with the application by performing CRUD operations on articles and comments as well as voting on comments.

It was built using Node.js and Express.js and uses PostgreSQL as its database. This API will serve as the backend API for a future frontend project to be built using React.js.

You can check out a live version of this app [here](https://nc-be-project.onrender.com), hosted using Render.

## Tech Stack
* Node.js
* Express.js
* PostgreSQL
* Supertest
* Jest

## Getting Started

### Minimum Requirements

* Node.js: *v20.4.0*
* PostgreSQL: *v14.9*

### Installation

1. Clone this repository
```
$ git clone https://github.com/vh232/NC-be-project.git
```
2. Run `npm install` to install dependencies listed in the `package.json`

### Create and Setup Environment Variables

1. Create two .env files:
</br>

```
$ touch .env.development
$ touch .env.test

```
2. Insert the following into each file.
 </br>
.env.development:
</br> 

```
PGDATABASE=nc_news
```
</br>
.env.test:

```
PGDATABASE=nc_news_test
```
</br> You can refer to `.env.example` for a template

### Initialise Databases

1. Run `npm run setup-dbs` to set up PostgreSQL database
2. Run `npm run seed` to populate databases.

### Testing

Run `npm test` to execute tests using Supertest and Jest. To start the local server run `npm run dev`.


