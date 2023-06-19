# Products API

[![Go](https://github.com/lucasvmiguel/products-api/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/lucasvmiguel/products-api/actions/workflows/build-and-test.yml)

## Description

Products API is a REST API written in Typescript where products can be created, read, updated and deleted.

Note: _This API has been configured for `development` environment. To use in a `production` environment, further setup will be required._

## Running the app

**Requirements:**

- [Node](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

1. Open a terminal and run the following command to start the persistence (database) required:

```bash
$ npm run persistence:up
```

2. In another terminal, start the application with the following command:

```bash
$ npm run dev
```

## Testing

### Unit test

```bash
$ npm test
```

### Stress test

TODO

## Configuration

- To configure how the app will run, check the following file: [.env](.env)

## Architecture

This section describes what are the goals of the system and some of its design and implementation.

### Requirements

The following list shows all user requirements implemented by the system.

- As a user, I can fetch all products using a REST API.
- As a user, I can fetch a paginated list of products using a REST API. #TODO
- As a user, I can fetch a product by its id using a REST API.
- As a user, I can create a product using a REST API.
- As a user, I can update some fields (`name` and/or `code`) of a product by its id using a REST API.
- As a user, I can delete a product by its id using a REST API.

### Schema

The following picture shows all the entities of the system.

![schema](/docs/schema.png)

### System Design

The following pictures shows some of the details of how the system is designed and implemented.

![system design](/docs/system-design.png)
![layers](/docs/layer.png)

### Folder/File structure

- `/src`: Application source code
- `/src/index.ts`: Application start file.
- `/src/app.ts`: Where the API routes are defined.
- `/src/utils`: Helper libraries to support the application.
- `/src/product`: Product domain, where every code related to product should be placed. (Inspired by [DDD](https://en.wikipedia.org/wiki/Domain-driven_design))
- `/test`: Integration tests that run with external apps. (eg: database)
- `/.github`: CI/CD from Github.
- `docker-compose.yml`: Used to spin up the persistence layer in development and testing.
- `.env`: configures project.
- `package.json`: Project's executable tasks.

### Stack

- Language: [Node](https://nodejs.org/)
- API/REST framework: [Express](https://expressjs.com/)
- Database ORM: [Prisma](https://www.prisma.io/)
- Config reader: [dotenv](https://github.com/motdotla/dotenv)
- Database: [Postgres](https://www.postgresql.org/)

## API Docs

This section is described the REST API's endpoints (URL, request, response, etc).

<details>
<summary>Create product</summary>

Endpoint that creates a product

#### Request

```
Endpoint: [POST] /api/v1/products

Headers:
  Content-Type: application/json

Body:
  {
    "name": "Product name",
    "stock_quantity": 10
  }
```

#### Response

**Success**

```
Status: 201

Body:
  {
    "id": 1,
    "name": "Product name",
    "code": "70a17d32-a670-4396-9706-bd0940152fc7",
    "stock_quantity": 10,
    "created_at": "2022-07-08T18:53:57.936433+01:00",
    "updated_at": "2022-07-08T18:53:57.936433+01:00"
  }
```

**Bad Request**

```
Status: 400
```

**Internal Server Error**

```
Status: 500
```

</details>

<details>
<summary>Get products paginated #TODO</summary>

Endpoint to get products paginated

#### Request

##### Query Parameters

- `cursor`: use the response's `next_cursor` field
- `limit`: limit of products to be returned (min=1, max=100)

```
Endpoint: [GET] /api/v1/products?limit=10&cursor=2

Headers:
  Content-Type: application/json
```

#### Response

**Success**

```
Status: 200

Body:
  {
    "items": [
      {
        "id": 1,
        "name": "foo",
        "code": "70a17d32-a670-4396-9706-bd0940152fc7",
        "stock_quantity": 1,
        "created_at": "2022-07-08T18:53:57.936433+01:00",
        "updated_at": "2022-07-08T18:53:57.936433+01:00"
      }
    ],
    "next_cursor": 2
  }
```

**Internal Server Error**

```
Status: 500
```

</details>

<details>
<summary>Get all products</summary>

Endpoint to get all products (does not have pagination)

#### Request

```
Endpoint: [GET] /api/v1/products/all

Headers:
  Content-Type: application/json
```

#### Response

**Success**

```
Status: 200

Body:
  [
    {
      "id": 1,
      "name": "foo",
      "code": "70a17d32-a670-4396-9706-bd0940152fc7",
      "stock_quantity": 1,
      "created_at": "2022-07-08T18:53:57.936433+01:00",
      "updated_at": "2022-07-08T18:53:57.936433+01:00"
    }
  ]
```

**Internal Server Error**

```
Status: 500
```

</details>

<details>
<summary>Get product by id</summary>

Endpoint to get a product by id

#### Request

```
Endpoint: [GET] /api/v1/products/{id}

Headers:
  Content-Type: application/json
```

#### Response

**Success**

```
Status: 200

Body:
  {
    "id": 1,
    "name": "foo",
    "code": "70a17d32-a670-4396-9706-bd0940152fc7",
    "stock_quantity": 1,
    "created_at": "2022-07-08T18:53:57.936433+01:00",
    "updated_at": "2022-07-08T18:53:57.936433+01:00"
  }
```

**Not Found**

```
Status: 404
```

**Internal Server Error**

```
Status: 500
```

</details>

<details>
<summary>Update product by id</summary>

Endpoint that updates a product by id

#### Request

```
Endpoint: [PUT] /api/v1/products/{id}

Headers:
  Content-Type: application/json

Body:
  {
    "name": "new product name",
    "stock_quantity": 5
  }
```

#### Response

**Success**

```
Status: 200

Body:
  {
    "id": 1,
    "name": "new product name",
    "code": "70a17d32-a670-4396-9706-bd0940152fc7",
    "stock_quantity": 5,
    "created_at": "2022-07-08T18:53:57.936433+01:00",
    "updated_at": "2022-07-08T18:53:57.936433+01:00"
  }
```

**Bad Request**

```
Status: 400
```

**Not Found**

```
Status: 404
```

**Internal Server Error**

```
Status: 500
```

</details>

<details>
<summary>Delete product by id</summary>

Endpoint to delete a product by id

#### Request

```
Endpoint: [DELETE] /api/v1/products/{id}

Headers:
  Content-Type: application/json
```

#### Response

**Success**

```
Status: 204
```

**Not Found**

```
Status: 404
```

**Internal Server Error**

```
Status: 500
```

</details>

## Configuration

A file called `.env` has all config used in the project.

In the future, a service like [Doppler](https://www.doppler.com/) or [Vault](https://www.vaultproject.io/) could (and should) be used in the project.

## CI/CD

The project uses Github CI to run tests, builds (and possibly deployments). You can see the badge below:
<br />
[![Go](https://github.com/lucasvmiguel/products-api/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/lucasvmiguel/products-api/actions/workflows/build-and-test.yml)

Steps:

1. Set up Nodejs
2. Build
3. Unit/Integration Test
4. Log in to the Container registry (Github)
5. Build and push Docker images

## Roadmap

- import with @
- essential libraries in utils? eg: Controller
- test e2e
- test integration if service/database fails
- paginates products
- add graphql
