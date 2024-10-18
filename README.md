# URL Shortener

## Overview

This URL Shortener app allows users to shorten long URLs into shorter strings. It generates a shortened URL that redirects to the original link.

Key features include:
- Generation of short URLs (using **md5** hashing with **unique UUID** appended to the long URL)
- Encryption of long URLs before saving them (using the algorithm **aes-256-cbc** with **ENCRYPTION_KEY** to protect user information)
- Redirection to the original URL when using the short URL.

This application is built using **NestJS** framework and **MySQL** database to persist the data across app restarts. It uses also **Grafana k6** for load testing.


## Requirements

- Docker
- Docker compose CLI
- Node.js version 20 or higher

## Getting Started

1. Make sure docker is running on your machine. Then, start the database container by running the following command:
```bash
docker compose up -d
```
2. Install dependecies
```bash
npm install
```
3. Add your 32 chars encryption key under `/configuration/encryption.env` (due to the used encryption algorithm). It is validated by the app on server start.
(It should be normally under `.gitignore`. It was kept for convenience of testing the app.)
4. Start the application by running:
```bash
npm run start:dev
```

### Usage

Once the application is running, you can access the API documentation via **Swagger** at the following URL:

[http://localhost:3000/api](http://localhost:3000/api)

This documentation allows you to explore the available endpoints and test them directly.

## Testing

This project includes two load testing scripts to evaluate performance:

1. **Load Generation Test Script**: To run the load test for generating 500000 short URLs, execute the following command:
   ```bash
   docker run --rm -i grafana/k6 run - <generate.test.js
2. **Load Navigation/Redirection Test Script**: 
To run the load test for handling 100 navigation requests per 1s, add a list of 100 shortUrls that were generated and exist on your database.
Besides, note please that the 301 redirection response is not properly handled within the docker container.
Instead, if the goal is to test the speed of database lookups and of decryption algorithm, update the redirect request response to return 200 status and execute the following command: 
   ```bash
   docker run --rm -i grafana/k6 run - <redirect.test.js

