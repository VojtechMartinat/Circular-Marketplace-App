# Circular Marketplaces Handover

## Contents
- [Introduction](#introduction)
- [Build and Execution](#build-and-execution)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Database Structure](#database-structure)
- [AWS Setup](#aws-setup)
- [Further Documentation](#further-documentation)

## Introduction
This document serves as a technical guide for new developers to begin working on this project, given existing code infrastructure. It will explain the purpose of a large proportion of the repository, with further code-specific details being found in comments throughout the codebase.

## Build and Execution
### Quick Links
- [Prerequisites](#prerequisites)
- [Environment Variables Setup](#environment-variables-setup)
- [Backend](#backend)
- [Frontend](#frontend)
- [Full Stack](#full-stack-local-production-environment)

### Prerequisites
- Must have [```Node.js```](https://nodejs.org/en/download) installed.

Clone the repository by either:
- using ```git clone https://github.com/spe-uob/``` (HTTPS).

### Environment Variables Setup

- To run this project, you need to create a `.env` file in the root directory and add the following:

```env
NAME=
DB_USER=
DB_PASS=
REACT_APP_FIREBASE_API=
REACT_APP_FIREBASE_APP_ID=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

- In the  `app/backend/config` directory also plce the following `firebaseAdmin.json` file:

```firebaseAdmin.json
{
  "type": "service_account",
  "project_id": "circular-marketplace-972a4",
  "private_key_id": "",
  "private_key": "",
  "client_id": "",
  "auth_uri": "",
  "token_uri": "",
  "auth_provider_x509_cert_url": "",
  "client_x509_cert_url": "",
  "universe_domain": ""
}
```

### Frontend 
> [!NOTE]
> The following instructions will start the frontend services ONLY in a non-production environment. This includes all React packages running on a development server.
> The primary usage of following the next steps is for fast local testing of the frontend

Run the following commands in the given order
- Navigate to the frontend directory using ```cd app/frontend```.
- Ensure you have Node.js, npm  and "react-router-dom" installed.
- Run `npm install` to install all dependencies. 
- Run `npm start` to run the app in the development mode and `npm test` to run the tests.

> [!WARNING]
> Please note that starting the backend and frontend separately as detailed by the two guides above will not allow them to communicate together correctly, as a result of incorrect port configurations.
> In order to prevent any errors when trying to run a full-stack environment, please follow the [instructions](#full-stack-local-production-environment) directly below.


### Backend 
> [!NOTE]
> The following instructions will start the frontend services ONLY in a non-production environment. This includes all React packages running on a development server.
> The primary usage of following the next steps is for fast local testing of the backend.

Run the following commands in the given order
- Navigate to the frontend directory using ```cd app/backend```.
- Ensure you have Node.js, npm  and "react-router-dom" installed.
- Run `npm install` to install all dependencies. 
- Run `npm start` to run the app in the development mode and `npm test` to run the tests.

> [!WARNING]
> Please note that starting the backend and frontend separately as detailed by the two guides above will not allow them to communicate together correctly, as a result of incorrect port configurations.
> In order to prevent any errors when trying to run a full-stack environment, please follow the [instructions](#full-stack-local-production-environment) directly below.


## System Architecture
Find the final product system architecture diagram below (with the suggested use of AWS services found [here](#aws-setup)):
PASTE HERE

## Project Structure
The top-layer project structure can be found below:
```
.
├── .github/                           # GitHub related files
├── docs/                              # Project documentation
├── app/                               # All backend and frontend code
└── **miscellaneous files**            # README, dependencies, gitignore, etc.
```

### Quick Links
Use the following quick links to navigate between explanations of the top level of the repository:
- [./.github](#github)
- [./docs](#docs)
- [./app](#app)

### ./.github
The structure within the ```./.github``` directory can be found below:
```
.
├── ISSUE_TEMPLATE/                    # Templates for GitHub issues 
│   ├── ...
├── workflows/                         # Continuous Integration/Deployment workflows ran via GitHub Actions
│   ├── ...
└── pull_request_template.md           # Template for GitHub pull request
```

#### Quick Links
Use the following quick links to navigate between explanations of the ```.github``` directory:
- [./.github/ISSUE_TEMPLATE](#githubissue_template)
- [./.github/workflows](#githubworkflows)

#### ./.github/ISSUE_TEMPLATE
This directory contains templates that developers/users can fill out under the ```Issues``` section of the GitHub repository. It includes issues specific for new features, or bugs.

#### ./.github/workflows
This directory contains two separate workflows that are ran via GitHub actions:
- ```BackendTestsCI.yml``` - Continuous Integration
    - This workflow is ran on all pushes to the ```dev``` branch and pull requests.
    - It runs both the backend testing suites.
- ```DeployBackend.yml``` - Continuous Deployment
    - This workflow is ran on all pushes to all branches, and also on any pull requests (before merges).
    - It deploys the app using the AWS lambda service
- ```DeployFrontend.yml``` - Continuous Deployment
    - This workflow is ran on all pushes to all branches, and also on any pull requests (before merges).
    - It deploys the app using the AWS lambda service
- ```FrontendTestsCI.yml``` - Continuous Integration
    - This workflow is ran on all pushes to the ```dev``` branch and pull requests.
    - It runs both the frontend testing suites.


### ./docs
The structure within the ```./docs``` directory can be found below:
```
.
├── meeting-minutes/                   # Directory holding meeting minutes for important client meetings
│   ├── ...
├── Tech Stack/                          # Contains the iterations of the tech stack
│   ├── ...
├── UI Design/                          # Contains initial UI designs for all pages 
│   ├── ...
└── **miscellaneous files**            # Files including the ethics declaration, readme and testing guidelines etc.
```

### ./app
The structure within the ```./docs``` directory can be found below:
```
.
├── backend/                         # Contains the backend code files
│   ├── ...
├── frontend/                          # Contains the frontend code files
│   ├── ...
├── lambda/                          # Contains the lambda function file to facilitate the calls to the OpenAI API
│   ├── lambda_functions.py
└── **miscellaneous files**            # Files including the dependencies etc.
```

### ./app/backend
The structure within the ```./app/backend``` directory can be found below:
```
.
├── __tests__/                    # Directory holding all the testing suite files. Each file test the routes and the controllers for its model
│   ├── ...
├── config/                           # Directory holding the database setup files
│   ├── ...
├── controllers/                    # Directory holding the controllers for each database model. It defines the actions that can be performed on each model
│   ├── ...
├── database/                           # Directory holding the code for setting up and connecting to the remote database
│   ├── ...
├── errors/                    # Directory holding error API setup code
│   ├── ...
├── middleware/                           # Directory holding error handing and wrapper code
│   ├── ...
├── models/                    # Directory holding the code that sets up and defines the database models. Each model has its own file
│   ├── ...
├── routes/                           # Directory holding code that defines the API routes
│   ├── ...
└── **miscellaneous files**            # dependencies, server file etc.
```


### ./app/frontend
The structure within the ```./app/frontend``` directory can be found below:
```
.
├── public/                             # Directory holding the favicon file
│   ├── ...
├── src/                                # Directory holding the frontend react code
│   ├── ...                            
└── **miscellaneous files**            # dependencies, etc.
```

### ./app/frontend/public
The structure within the ```./app/frontend/public``` directory can be found below:
```
.
├── Components/                 # Directory holding a file for each the pages of the frontend and its associated functions, as well as their styling.  
│   ├── ...
├── Config/                     # Directory holding the file that points the frontend to the backend address
│   ├── ...                            
├── Contexts/                     # Directory holding the code for the user login status
│   ├── ...                            
├── __tests__/                     # Directory holding the tests for main frontend pages. Each test checks whether the page content renders
│   ├── ...                            
├── services/                     # Directory holding the code for fetching data from the database for each model
│   ├── ...                            
└── **miscellaneous files**            # the main App.js file, the test setup and logo vector etc.
```

## Database Structure
Find the database structure UML diagram below:

![DB_design drawio-2](https://github.com/user-attachments/assets/58be311b-cf0f-458a-a397-8127112e65bf)

### Quick Links
Use the following quick links to navigate between explanations of the different database objects:
- [Article](#Article)
- [Article_Tag](#Article_Tag)
- [Message](#Message)
- [Order](#Order)
- [PaymentCard](#PaymentCard)
- [Photo](#Photo)
- [Review](#Review)
- [Tag](#Tag)
- [Task](#Task)
- [TaskLog](#TaskLog)
- [User](#User)
- [Wishlist](#Wishlist)


### Article  
This model represents articles listed in the marketplace.  

| Field           | Sequelize Data Type  | Explanation                                                               |  
|----------------|----------------------|---------------------------------------------------------------------------|  
| `articleID`    | UUID                 | **Primary key:** Unique identifier for each article, generated automatically |  
| `userID`       | STRING(30)           | **Foreign key:** References the user who listed the article               |  
| `orderID`      | UUID (nullable)      | **Foreign key:** References an order if the article has been purchased    |  
| `articleTitle` | STRING               | The title of the article                                                  |  
| `description`  | STRING               | A short description of the article                                        |  
| `price`        | DOUBLE               | The price of the article, required field                                  |  
| `state`        | ENUM                 | The current state of the article (`uploaded`, `sold`, `archived`, `collected`) |  
| `shippingType` | ENUM                 | Available shipping methods (`shipping`, `collection`, `both`), defaults to `both` |  

### Article_Tag  
This model represents the many-to-many relationship between articles and tags.  

| Field       | Sequelize Data Type | Explanation                                               |  
|------------|---------------------|-----------------------------------------------------------|  
| `tagID`    | UUID                | **Foreign key:** References a tag associated with an article |  
| `articleID` | UUID                | **Foreign key:** References an article linked to a tag    |  

### Message  
This model represents messages exchanged between users.  

| Field        | Sequelize Data Type | Explanation                                                   |  
|-------------|---------------------|---------------------------------------------------------------|  
| `messageID` | UUID                | **Primary key:** Unique identifier for each message, auto-generated |  
| `senderID`  | STRING(30)          | **Foreign key:** References the user who sent the message    |  
| `receiverID` | STRING(30)         | **Foreign key:** References the user who received the message |  
| `message`   | STRING              | The content of the message, required field                   |  

### Order  
This model represents orders placed by users in the marketplace.  

| Field            | Sequelize Data Type | Explanation                                                        |  
|-----------------|---------------------|--------------------------------------------------------------------|  
| `orderID`       | UUID                | **Primary key:** Unique identifier for each order, auto-generated |  
| `userID`        | STRING(30)          | **Foreign key:** References the user who placed the order         |  
| `paymentMethodID` | UUID              | **Foreign key:** References the payment method used for the order |  
| `dateOfPurchase` | DATE                | The date when the order was placed, required field                |  
| `totalPrice`    | DOUBLE               | The total price of the order                                      |  
| `collectionMethod` | ENUM              | The method of receiving the order (`delivery`, `collection`)      |  
| `orderStatus`   | ENUM                 | The current status of the order (`purchased`, `shipped`, `collected`) |  


### PaymentCard  
This model represents payment methods associated with users.  

| Field            | Sequelize Data Type | Explanation                                                      |  
|-----------------|---------------------|------------------------------------------------------------------|  
| `paymentMethodID` | UUID              | **Primary key:** Unique identifier for each payment method, auto-generated |  
| `userID`        | STRING(30)          | **Foreign key:** References the user who owns the payment method |  
| `cardHolder`    | STRING              | The name of the cardholder                                       |  
| `sortCode`      | INTEGER             | The bank sort code                                               |  
| `cardNumber`    | INTEGER             | The card number                                                  |  
| `expiryDate`    | DATE                | The expiration date of the card                                  |  


### Photo  
This model represents photos associated with articles in the marketplace.  

| Field       | Sequelize Data Type | Explanation                                                 |  
|------------|---------------------|-------------------------------------------------------------|  
| `photoID`  | UUID                | **Primary key:** Unique identifier for each photo, auto-generated |  
| `image`    | BLOB                | The image data stored in binary format                      |  
| `articleID` | UUID               | **Foreign key:** References the article the photo belongs to |  


### Review  
This model represents user reviews for articles in the marketplace.  

| Field       | Sequelize Data Type | Explanation                                                 |  
|------------|---------------------|-------------------------------------------------------------|  
| `reviewID`  | UUID                | **Primary key:** Unique identifier for each review, auto-generated |  
| `rating`    | INTEGER             | A rating between 1 and 5                                    |  
| `comment`   | STRING              | The review comment (1 to 5000 characters)                   |  
| `userID`    | STRING(30)          | **Foreign key:** References the user receiving the review   |  
| `reviewer`  | STRING(30)          | **Foreign key:** References the user who wrote the review   |  
| `articleID` | UUID                | **Foreign key:** References the article being reviewed      |  

### Tag  
This model represents tags that can be associated with articles in the marketplace.  

| Field      | Sequelize Data Type | Explanation                                             |  
|-----------|---------------------|---------------------------------------------------------|  
| `tagID`   | UUID                | **Primary key:** Unique identifier for each tag, auto-generated |  
| `tagTitle` | STRING             | The name/title of the tag, required                     |  

### Task  
This model represents tasks in the system.  

| Field        | Sequelize Data Type | Explanation                                          |  
|-------------|---------------------|------------------------------------------------------|  
| `taskID`    | INTEGER             | **Primary key:** Unique identifier for each task    |  
| `description` | STRING            | A description of the task, required                 |  


### TaskLog  
This model represents logs for task completion with details about time taken.  

| Field        | Sequelize Data Type | Explanation                                                 |  
|-------------|---------------------|-------------------------------------------------------------|  
| `logID`     | UUID                | **Primary key:** Unique identifier for each task log, auto-generated |  
| `taskID`    | INTEGER             | **Foreign key:** References the task that the log is associated with |  
| `timeTaken` | BIGINT              | The amount of time taken to complete the task (in milliseconds) |  

### User  
This model represents users in the system.  

| Field      | Sequelize Data Type | Explanation                                             |  
|-----------|---------------------|---------------------------------------------------------|  
| `userID`  | STRING(30)          | **Primary key:** Unique identifier for each user        |  
| `username` | STRING             | The username of the user, required                      |  
| `wallet`   | DOUBLE             | The amount of money in the user's wallet, required      |  
| `location` | STRING             | The location of the user, optional                      |  

### Wishlist  
This model represents a user's wishlist containing articles and their prices.  

| Field        | Sequelize Data Type | Explanation                                                    |  
|-------------|---------------------|--------------------------------------------------------------|  
| `id`        | UUID                | **Primary key:** Unique identifier for each wishlist, auto-generated |  
| `userID`    | STRING(30)          | **Foreign key:** References the user who owns the wishlist, required |  
| `articleID` | UUID                | **Foreign key:** References the article in the wishlist, optional |  
| `totalPrice`| DOUBLE              | The total price of the articles in the wishlist, optional      |  


## AWS Setup
The following is some guidance for how the project can be deployed via cloud services (specifically on AWS).


### AWS Elastic Container Registry (ECR)
All Docker images are uploaded to the Elastic Container Registry to be used by the Elastic Container Service.

### AWS Elastic Container Service (ECS)
The project has been developed such that it can be deployed via multiple Docker images running in containers. All docker images are run within a cluster, but on a separate services, via AWS Elastic Container Service and AWS Fargate.
There are four services that are running on ECS:
- Django server
    - Running Gunicorn with Uvicorn workers and handles all requests
- Redis message broker
    - Allows communication between the server and celery workers
- Celery workers
    - Allows for an asynchronous background task queue for long-running tasks (like OpenAI requests)
- Nginx
    - Serves static web app files and acts as a reverse proxy for the backend server

### AWS Application Load Balancer (ALB)
There is also an Application Load Balancer running that has the custom domain registered to it, and forwards all requests to the ECS Nginx service. The purpose of this is to allow scalability and to also allow for a static IP address that the custom domain can be registered to. This is not achievable with just the ECS services as they are assigned a new IP address every time the service is restarted with an updated Docker image.

### AWS Route 53
Through the usage of AWS Route 53 and service discovery, the different ECS services are able to communicate with each other without a hardcoded IP address. This is essential as the ECS services are assigned a new IP address every time they are restarted with an updated Docker image.

### AWS Relational Database Service (RDS)
The PostgreSQL database is hosted in the cloud on AWS RDS. More information about the structure of the database can be found [here](#database-structure).

### AWS S3 Bucket
The project utilises an S3 Bucket for cloud storage in order to hold images that tenants upload via their chats, and any work order PDFs created by the system.

## Further Documentation
The following table contains links to other useful documentation for tools/libraries/frameworks used within this project:

| Tool               | Documentation Link                                                                           |
|--------------------|----------------------------------------------------------------------------------------------|
| Django             | [https://docs.djangoproject.com/en/5.1/](https://docs.djangoproject.com/en/5.1/)             |
| Celery             | [https://docs.celeryq.dev/en/stable/](https://docs.celeryq.dev/en/stable/)                   |
| Redis              | [https://redis.io/docs/latest/](https://redis.io/docs/latest/)                               |
| Gunicorn + Uvicorn | [https://www.uvicorn.org/deployment/#gunicorn](https://www.uvicorn.org/deployment/#gunicorn) | 
| Nginx              | [https://nginx.org/en/docs/](https://nginx.org/en/docs/)                                     |
| React              | [https://react.dev/learn](https://react.dev/learn)                                           |  
| Docker             | [https://docs.docker.com/](https://docs.docker.com/)                                         |
| AWS                | [https://docs.aws.amazon.com/](https://docs.aws.amazon.com/)                                 |
| OpenAI API         | [https://platform.openai.com/docs/overview](https://platform.openai.com/docs/overview)       |
