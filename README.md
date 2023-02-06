# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {https://github.com/SeGeGha/nodejs2022Q4-service}
```

## Installing NPM modules

```
git checkout feat/create-rest-service
```

```
npm install
```

## Running application

Rename .env.example to .env. You can set PORT (default 4000). For Swagger UI need set `SWAGGER_YAML_PATH = ../doc/api.yaml`

```
npm start:dev
```

or

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
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

