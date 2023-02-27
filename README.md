# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://docs.docker.com/engine/install/)

## Downloading

```
git clone https://github.com/SeGeGha/nodejs2022Q4-service
```

## Installing NPM modules

```
git checkout feat/authentication-and-authorization
```

```
npm install
```

## Running application

Rename .env.example to .env. You can set PORT (default 4000). For Swagger UI need set `SWAGGER_YAML_PATH = doc/api.yaml` (specified by default)

Build services
```
npm run docker:build
```
Start containers
```
npm run docker:up
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.

If docker doesn't build images try adding current directory to docker resources as in image

![image](https://user-images.githubusercontent.com/21230284/218312899-e039c4ac-0777-46da-9ac4-46829c26341b.png)

## Migrations

Migrations will be automatically applied from `src/migrations` after starting the application (.env -> TYPEORM_MIGRATIONS_RUN=true). 

Generate migrations:
 - delete src/migrations; 
 - use migration:generate script
 ```
 npm run migration:generate
 ```
 
Manual migration running:
 ```
 npm run migration:run
 ```
 
 Revert migration:
 ```
 npm run migration:revert
 ```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```
or
```
npm run docker:test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```
or
```
npm run docker:test:auth
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Moments of the application

- unnecessary DTO fields are truncated and not included in the database models
- successfull POST `favs/*/id` response contains `artists: Artist[], albums: Album[], tracks: Track[]`
- if the artist (album, track) has already been added to favorites, the second addition will be ignored
