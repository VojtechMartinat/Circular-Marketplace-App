# Circular Marketplaces Handover

## Contents
- [Introduction](#introduction)
- [Build and Execution](#build-and-execution)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Database Structure](#database-structure)
- [AWS Setup](#aws-setup)
- [Further Documentation](#further-documentation)
- [Future Development Recommendations](#future-development-recommendations)

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

- In the  `app/backend/config` directory also place the following `firebaseAdmin.json` file:

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
# 1. Creating the Root User in AWS

## A. Creating a New AWS Account and Root User

### 1. Go to the AWS Sign-Up Page:
Visit the AWS Sign-Up Page and click on **Create an AWS Account**.

### 2. Enter Your Email and Account Name:
- Enter a valid email address that will serve as the root account email. Make sure this email address is secure, as it will be used to recover the account in case you forget your password or need to verify your identity.
- Choose an AWS account name (e.g., MyCompanyAWSAccount).

### 3. Provide Billing Information:
Enter your billing information (credit card, address, etc.). AWS offers a free tier for new accounts, but they still require billing details for verification.

### 4. Choose a Support Plan:
Select a support plan that fits your needs (Basic, Developer, Business, or Enterprise).

### 5. Verify Your Identity:
AWS will require you to verify your phone number via a text or voice call.

### 6. Payment Verification:
AWS will perform a small charge on your credit card to verify your payment method.

### 7. Root User Credentials:
Once your account is created, you will receive an email to confirm your email address.
You can then sign in to your new AWS account as the root user with the email and password that you set during the sign-up process.

---

## B. Securing the Root User

Once you have access to your root user account, it’s crucial to secure it by following best practices:

### Enable Multi-Factor Authentication (MFA) for the Root User:
This is one of the most important steps in securing the root user account.

### Steps to Enable MFA for Root User:
1. Sign in to the AWS Management Console as the root user.
2. In the top-right corner, click on your account name.
3. Choose **Security Credentials** from the dropdown menu.
4. Scroll down to the **Multi-Factor Authentication (MFA)** section.
5. Click on **Assign MFA device**.
6. Choose **Authenticator app** and assign a name to the device.
7. Follow the on-screen instructions to scan the QR code using your mobile MFA app.
8. Enter the MFA code from the app to complete the setup.

> **Note:** You should never use root when creating new AWS services unless it is required to use it. Now, we will create an Administrator User, which should be used instead of the root user.

---

# 2. Creating an IAM User in AWS (The Administrator User)

## Step-by-Step Guide

### 1. Sign in to the AWS Console:
Go to AWS Console and sign in with your root account.

### 2. Navigate to IAM:
In the AWS Management Console, search for IAM in the search bar.

### 3. Create a New User:
1. In the left sidebar of the IAM Dashboard, click on **Users**.
2. Click the **Add user** button at the top.

### 4. Set User Details:
- **User Name**: Enter a user name for the new user.
- **Access Type**: Choose the access type for the user.
  - AWS Management Console access: Allows the user to access the AWS Console using a web browser.
  - Check **(I want to create an IAM user)**.
  - Click on **Autogenerated password** and **Users must create a new password at next sign-in**.
  - Click **Next**.

### 5. Set Permissions:
You will be prompted to set permissions for the new user. You can assign permissions in one of the following ways:
- **Attach existing policies directly**: This is where you can attach predefined AWS policies (e.g., AdministratorAccess).
- Click on **Attach policies directly** and select **AdministratorAccess** (This will allow the user to do almost everything on AWS).

### 6. Review and Create:
Review all the settings you’ve configured.
If everything looks correct, click **Create user**.

### 7. Download Credentials:
Once the user is created, you'll be presented with the success screen.
- Click on **Download .csv** to save the user credentials, including their **Access Key ID**, **Secret Access Key**, and **Console login URL**. This will allow the user to access their AWS account.
---

### 8. Login to the Administrator Account

### 9. Create a User for the backend:
- Go to the **IAM** service in the AWS Console.
- Click **Add user**.
- Enter a username (e.g., **backend**).
- Select **Programmatic access**.
- Click **Next: Permissions**.
- Click **Attach existing policies directly**.
- Select : **Amazon CloudFront**, **Amazon S3**, **AWS Security Token Service**, **AWS Lambda**, **Key Management Service**, **AWS Security Token Service**
- Click **Create user**.
- Copy the **Access key ID** and **Secret access key**.
- Add these keys to the **.env** file and to the github secrets.

> **Note**: We are using the least privilege principle. The backend user only has access to the services it needs to use. We use this for security reasons.
---

# 3. Amazon RDS (Relational Database Service)

## Steps:

### 1. Sign in to AWS Console:
Go to AWS Console and log in.

### 2. Launch RDS Instance:
- Navigate to the **Aurora** and **RDS** service from the AWS Management Console.
- In the top-right corner, choose a region for the database (Ireland/London/… Most services will require a region to be selected. If you create a service in Ireland and you change the region to London, then you won't be able to see it).
- Click on **Create Database**.
- Choose **Click Easy Create** and **PostgreSQL**.
- Select **Free Tier** in DB instance size.
- Provide a name for the DB in **DB cluster Identifier** field.
- Click **On Self-managed Credentials Settings**. Create a master username (later referred to as **DB_USER** in API keys) and master password (**DB_PASS** in API keys).
- Click **Create Database**.

### 3. Connect to RDS:
- Go to the **Databases** section in the RDS dashboard.
- Select your RDS instance, and under **Connectivity & Security**, copy the Endpoint.
- In **app/backend/database/connect.js**, set the host to the endpoint.

---

# 4. AWS Lambda (region Ireland/London)

Lambda lets you run code in response to events like changes in data or HTTP requests, without provisioning or managing servers.

## Backend Steps:

### 1. Create Lambda Function:
- Navigate to the **Lambda** service in the AWS Console.
- Click **Create function**.
- Choose **Author from scratch**.
- Enter a function name (e.g., **backend**).
- In **Runtime**, choose **Node.js 18.x**.
- Click **Create function**.

### 2. Upload Code:
- In the function configuration, go to the **Code** section.
- Navigate to **app/backend** on your PC. Type `npm install` to install all dependencies. Now zip the folder (e.g. `zip -r lambda-app.zip . -x "*.git*" "*.log*" “*.env*”`).
- In the code section, click **Upload from** and **.zip file**.
- Upload the file.
- Go to the **Configuration** and choose **Environment variables**. Click **edit** and add environment variables. Add 2 variables (**DB_USER** and **DB_PASS**) and assign them to the value of the master user and master password from the last step.
- In the **Runtime setting** section, update the **Handler** to `server.handler`.

---

## AI Steps:

### 1. Create Lambda Function:
- Navigate to the **Lambda** service in the AWS Console.
- Click **Create function**.
- Choose **Author from scratch**.
- Enter a function name (e.g., **ai**).
- In **Runtime**, choose **Python 3.10**.
- Click **Create function**.

### 2. Upload Code:
- In the function configuration, go to the **Code** section.
- (Currently, there are several issues with one of the OpenAI dependencies which makes it hard to build the dependencies manually. Please use the **ai.zip** provided in the GitHub repository).
- In the code section, click **Upload from** and **.zip file**.
- Upload the file.
- Go to the **Configuration** and choose **Environment variables**. Click **edit** and add the environment variable **OPENAI_API_KEY** and assign it to the API key from OpenAI.

---

# 5. AWS Certificate Manager (ACM) Setup Guide (Region Global)

## 1. Access AWS Certificate Manager
- Sign in to AWS Management Console: Go to AWS Console.
- In the search bar, type **Certificate Manager** and select the service.

## 2. Choose a Certificate Type:
- Click on **Request a certificate**.
- Choose **Request a public certificate**.

## 3. Request a Public SSL/TLS Certificate
- **Enter the Domain Name**: Enter the domain name that you want to secure. Example: `relist.live`. Also add `*.relist.live` to secure all subdomains.
- **Choose Validation Method**: DNS Validation (Recommended): AWS provides a CNAME record that you must add to your domain’s DNS settings.
- **Request the Certificate**: Click **Request** to submit the request.

## 4. Validate the Certificate

The certificate status will be Pending Validation until you complete DNS validation.

### A. DNS Validation:
- Go to the Certificate details page in ACM.
- Copy the CNAME record provided by AWS.
- Go to your DNS provider (e.g., Route 53, Cloudflare, GoDaddy, Name.com) and add the CNAME record.
- AWS will automatically validate the certificate once the DNS record is propagated (this may take a few minutes to a few hours).

---

# 6. API Gateway (region Ireland/London)

Amazon API Gateway is a fully managed service that allows you to create and publish APIs.

## Backend Steps:

### 1. Create a New API:
- Navigate to the **API Gateway** service in the AWS Console.
- Click **Create API** and choose **HTTP API**.

### 2. Configure API Gateway:
- Define the name of your API (e.g., **backend**).
- Choose **Lambda** as the integration type.
- Select the Lambda function created earlier.
- Configure routes:
  - Click **Add a route** and select method **any**.
  - In the Resource path type `/ {proxy+}` (This allows all resource paths).
  - Link it to your backend Lambda function created earlier.
  - Press **Next** and **Create**.

### 3. API config:
- Click **API: name(id)** on the left.
- Click **Edit** and disable default endpoint.
- Click **Save**.
- Click **Custom domain names** and **Add domain name**.
- In the domain name type your domain (e.g., **api.relist.live**).
- In the ACM certificate field, select the previously created certificate.
- Click **Add domain**.
- Click on the domain and copy the **API Gateway domain name** field.
- Add a **CNAME DNS** on the DNS provider.
  - **HOST**: `api.relist.live`
  - **ANSWER**: API Gateway domain name.

---

## AI Steps:

### 1. Create a New API:
- Navigate to the **API Gateway** service in the AWS Console.
- Click **Create API** and choose **HTTP API**.

### 2. Configure API Gateway:
- Define the name of your API (e.g., **ai**).
- Choose **Lambda** as the integration type.
- Select the AI Lambda function created earlier.
- Configure routes:
  - Click **Add a route** and select method **POST**.
  - In the Resource path type `/describe`.
  - Link it to your AI Lambda function created earlier.
  - Press **Next** and **Create**.

> **Note**: In this API Gateway, we don't edit the default endpoint.

---

# 7. AWS S3 Setup for CloudFront (S3 region Ireland/London, CloudFront region Global)

## 1. Create an S3 Bucket
- Go to the AWS Console → Search for **S3**.
- Click **Create bucket**.

### Configure the Bucket Settings:
- **Bucket Name**: Enter a unique name (e.g., **mywebsite-bucket**).
- **Bucket Versioning**: (Optional) Enable for version control of files.
- **Encryption**: Enable S3-managed keys (SSE-S3) for security.
- Click **Create Bucket**.

## 2. Upload Files to S3
- Open your S3 bucket.
- In your terminal, navigate to the **app/frontend** and type `npm run build`.
- Click **Upload** and add all files from the build folder created in the last step (Note that you should add the files inside, not the folder itself).
- Click **Upload**.

## 3. Set Up CloudFront Distribution
- Go to the AWS Console → Search for **CloudFront**.
- Click **Create Distribution**.

### Origin Settings:
- **Origin Domain Name**: Choose your S3 bucket from the dropdown.
- **Origin Access**: Select "Origin access control settings (recommended)".
  - Click **Create new OAC** and **Create**.
  - Click **Yes, Update Bucket Policy** to allow CloudFront access.
- **Origin Protocol Policy**: Choose **HTTPS Only**.

### Cache Behavior Settings:
- **Viewer Protocol Policy**: Choose **Redirect HTTP to HTTPS**.
- **Allowed HTTP Methods**: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE.
- **Caching Policy**: Select **CachingOptimized** (or customize if needed).
- Enable **WAF**.
- In **price class**, select **North America and Europe**.

### Custom Domain:
- Under **Settings**, set **Alternate Domain Name (CNAMEs)** (e.g., **cdn.mywebsite.com**).
- Select an SSL Certificate from AWS Certificate Manager (ACM).
- Click **Create Distribution**.
- Yellow notification will appear. Press **Copy policy** then click **Go to S3 bucket**. … and paste the policy in **Permissions -> Bucket Policy**.

## 4. Update DNS (For Custom Domain)
- Go to your DNS provider.
- Create a **CNAME** record:
  - **Name**: `relist.live`
  - **Type**: **CNAME**
  - **Value**: CloudFront domain name (e.g., `abc123.cloudfront.net` can be found in General setting of CloudFront distribution).
  - **TTL**: 300 (or default).

---

# 8. Amazon SES (Simple Email Service region: Ireland/London)

## Steps:

### 1. Verify Domain/Email Address:
- Go to the SES service in the AWS Console.
- Click **Verified identities** and choose **Create identity**.
- Choose **Email address** or **Domain**, and follow the instructions to verify your email/domain.

### 2. Set Sending Limits:
- If your SES account is in the sandbox environment, you will need to request production access to lift sending limits.

### 3. Send Email via SES:
- Use the SMTP interface or API to send emails.
- For API, configure IAM roles to give Lambda or other services the necessary permissions to send email through SES.

### 4. Monitor Email Deliverability:
- Use SES’s built-in tools to monitor deliverability and manage bounces and complaints.


# 9. GitHub Actions
- In the deploy backend workflow update --function-name to the name of the backend lambda function.
- In the deploy frontend workflow update --distribution-id to the CloudFront distribution ID. Also update the s3 bucket name (currently s3://relistserver).

## Further Documentation
The following table contains links to other useful documentation for tools/libraries/frameworks used within this project:

| Tool               | Documentation Link                                                                           |
|--------------------|----------------------------------------------------------------------------------------------|
                                 |
| AWS                | [https://docs.aws.amazon.com/](https://docs.aws.amazon.com/)                                 |
| OpenAI API         | [https://platform.openai.com/docs/overview](https://platform.openai.com/docs/overview)       |

## Future Development Recommendations
The following recommendations outline key features that can enhance the project's functionality and user experience in future development phases.

### Introduce Payments Connected to Bank Account
- Implement a payment gateway such as Stripe or PayPal to allow users to make transactions securely.
- Ensure proper handling of sensitive financial data by following industry security standards.
- Provide users with a transaction history page to track their payments.

### Basket Functionality
- Develop a shopping cart feature where users can add, remove, and update items before checkout.
- Implement persistent storage so that users' baskets are saved even if they navigate away from the site.
- Include a "Save for Later" option to allow users to store items for future purchase.

### Adding Tags to Different Articles
- Extend the existing tag model in the backend to associate tags with articles.
- Implement a tagging system on the frontend, allowing users to filter and search articles by tags.
- Provide an admin interface to manage available tags for better content organization.
- Allow users to add tags when posting an article through the post article page.
- Implement AI-generated tag suggestions to improve categorization and enhance the user experience.

### Publishing to the App Store
- Package the application for mobile platforms and prepare it for submission to the Apple App Store and Google Play Store.
- Ensure compliance with App Store and Google Play policies, including security and privacy requirements.
- Optimize the app for mobile user experience, including performance improvements and UI adjustments.