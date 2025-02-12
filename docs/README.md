# 2024-CircularMarketplaces

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Project Goals](#project-goals)
- [User Stories](#user-stories)
- [Stakeholders](#stakeholders)
- [Documentation](#documentation)
- [License](#license)
- [Setup and Deployment](#setup-and-deployment)
- [Acknowledgements](#acknowledgements)
- [Initial Stakeholders](#initial-stakeholders)
- [Team Members](#team-members)
- [Project Structure](#project-structure)
- [Links](#links)
- [Technology Stack Diagram](#technology-stack-diagram)
  

## Project Overview

This project aims to transform second-hand marketplaces by harnessing the power of AI to deliver an unparalleled user experience. As part of this initiative, you will develop a dedicated robust app for Android and iOS, enabling users to effortlessly add items they no longer use to the platform. Unlike existing platforms, our vision includes an integrated minimal chatbot that simplifies uploading photos and describing items. Whether a user prefers typing or voice control, the app shall ensure a streamlined, quick and user-friendly experience. Additionally, AI shall be used to classify and tag uploaded photos for precise and efficient searches later by other users, perfectly matching users with the items they seek. Join us in creating a circular marketplace platform that sets new standards for simplicity and efficiency, contributing to reducing waste and fostering greater sharing.

## Features

* User login and profile required for buying and adding new articles
* Articles may be given away for free or at a cost
* Articles may either be shipped by the seller or collected by the buyer
* Articles can be managed through the user’s profile (e.g. edited and deleted)
* Ability to follow other buyers or sellers
* Comment section under each article being sold
* Reviews of each user available on their profile
* Chatbot to help the user search for articles
* AI search function that intelligently suggests articles for a buyer (e.g. answering queries such as "What is the the best gift for my athletic 10 year old nephew")
* Language selection options
* Full iOS, Android and website release
* Ability to wishlist articles
* Login via social media account
* Full payment implementation
* User wallet function with credit

## Project Goals

* Protect the environment since items can be reused and renewed.
* Provide the seller a quick and convenient way to get rid of items they no longer want, for money.
* Provide the buyer a straightforward way to find the articles they desire.

## User Stories

* As a buyer, I want to easily and simply upload items I no longer need, so I can declutter my home and contribute to a sustainable lifestyle
* As a buyer, I want to search for specific items quickly via simple yet powerful search tool, so I can find what I need without searching through irrelevant listings
* As a seller, I want to interact with a chatbot for assistance, so I can get help with uploading items or navigating the app
* As a seller, I want photos of my wares to be easy to find by other users, so I have a better chance of selling them 

  
## Stakeholders

* End Users (Buyers) - Buyers are wish to find unique, second-hand items at low prices in a simple, streamlined environment. They need an efficient search experience with detailed listings and personalized recommendations, as well as secure payment options to ensure safe transactions.
  
* End Users (Sellers) - Sellers want a user-friendly platform that allows them to easily upload and list items they no longer need, helping them declutter their homes. They are looking for clear communication tools to connect with potential buyers as well as a streamlined process for uploading listings.

* Legislators - Since a successful implementation of the system will require potentially identifying personal data to be stored, it must comply with data privacy regulations, especially GDPR. As a result all user data must be handled in a secure and transparent way.

  
## Team Members

| Members           | Email                                                 |
|-------------------|-------------------------------------------------------|
| Lukasz Krepa      | [zr23182@bristol.ac.uk](mailto:zr23182@bristol.ac.uk) |
| Karena Ho         | [iv23220@bristol.ac.uk](mailto:iv23220@bristol.ac.uk) |
| Vojtech Martinat  | [os23060@bristol.ac.uk](mailto:os23060@bristol.ac.uk) |  
| Herman Tsoi       | [ju22521@bristol.ac.uk](mailto:ju22521@bristol.ac.uk) | 
| Jagannath Sankar  | [yi23615@bristol.ac.uk](mailto:yi23615@bristol.ac.uk) | 

## Project Structure
<pre>
2024-CircularMarketplaces
.
├── .github/
├── app/
│   ├── backend/
│   │   ├── __tests__/               # Contains backend test files
│   │   ├── config/           
│   │   ├── controllers/             # Handles application logic
│   │   ├── databse/
│   │   ├── errors/
│   │   ├── middleware/
│   │   ├── models/                  # Defines database schemas and interactions
│   │   ├── routes/                  # Maps API endpoints to controllers
│   │   ├── .babelrc
│   │   ├── jest.config.js
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   └── server.js
│   ├── frontend/
│   │   ├── public/
│   │   │   ├── favicon2.ico
│   │   │   ├── index.html
│   │   │   ├── logo192.png
│   │   │   ├── logo512.png
│   │   │   ├── manifest.json
│   │   │   └── robots.txt                      
│   │   └── src/                     
│   │       ├── Components/          # Reusable UI elements
│   │       ├── Config/
│   │       ├── Contexts/            # Global state management files
│   │       ├── services/            # API call functions
│   │       ├── App.js               # Main React app component 
│   │       ├── App.test.js          # Tests for App.js
│   │       ├── index.css            
│   │       ├── index.js
│   │       ├── logo.svg
│   │       ├── reportWebVitals.js
│   │       └── setupTests.js
│   ├── README.md
│   ├── package-lock.json
│   └── package.json
└── docs/
  </pre>
## Links
Main Kanban

https://github.com/orgs/spe-uob/projects/175

Gantt Chart

https://github.com/orgs/spe-uob/projects/215


## Technology Stack Diagram
![Architecture](Architecture_Diagram.drawio.png)


# Project Setup Guide

## 1. Install Git (if not already installed)

- **For Ubuntu/Linux:**
  ```bash
  sudo apt update
  sudo apt install git
  ```

- **For macOS:**
  ```bash
  brew install git
  ```

- **For Windows:**
  [Download and install Git](https://git-scm.com/download/win).

---

## 2. Install Node.js 18 (if not already installed)

- **For Ubuntu/Linux:**
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

- **For macOS:**
  Install via Homebrew:
  ```bash
  brew install node@18
  ```

- **For Windows:**
  [Download Node.js 18.x installer](https://nodejs.org/en/download/).

---

## 3. Initialize Git Repository

1. Navigate to your project folder.
2. Run:
   ```bash
   git init
   ```

---

## 4. Clone Repository

To clone a Git repository:
```bash
git clone <repository-url>
```

---

## 5. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd app/backend
   ```

2. Install required packages (with `sudo` to install `nodemon` and `pm2` globally):
   ```bash
   sudo npm install
   ```

3. Set environment variables:
   ```bash
   export DB_USER=<your-db-username>
   export DB_PASS=<your-db-password>
   ```

4. **Launch the Backend**
   - **For Development and Production:**  
     Start the server with PM2:
     ```bash
     pm2 start server.js
     ```
   - **Stop the Backend:**  
     Stop all PM2 processes:
     ```bash
     pm2 stop all
     ```

   - **For Testing:**  
     Use `nodemon` to automatically restart the server on code changes:
     ```bash
     nodemon
     ```
   - **Stop Testing:**  
     Press `Ctrl + C` to stop.

---

## 6. Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd app/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Configure Backend URL**  
   Edit the backend URL in `src/Config/config.js` to point to your local backend (e.g., `http://localhost:8080/api/v1/`).

4. **Set Environment Variables**  
   ```bash
   export REACT_APP_FIREBASE_API=<your-REACT-APP-FIREBASE-API>
   export REACT_APP_FIREBASE_APP_ID=<your-REACT-APP-FIREBASE-APP-ID>
   ```
5. **Launch the Frontend**
   - **For Development and Testing:**  
     Start the frontend locally:
     ```bash
     npm start
     ```

   - **For Production:**  
     Build the frontend and run it using PM2:
     ```bash
     npm run build
     pm2 start npm --name "react-dev" -- start
     ```

   - **Stop the Frontend:**  
     Stop the PM2 process:
     ```bash
     pm2 stop all
     ```

---

