# Results Portal

The Results Portal is a web application built using Node.js, Express.js, MongoDB, and EJS. It allows students to retrieve their academic results and provides an admin interface for result management.

## Features

- Student Access:
  - Students can enter their roll number and semester to view their results.

- Admin Authentication:
  - Basic authentication for admin access.

- Admin Panel:
  - Secure panel to insert or update student results.

- MongoDB Integration:
  - Stores and retrieves student results dynamically.

## Project Structure
```
results-portal/
│── public/
│   ├── index.html
│   ├── logo.png
│   ├── restyles.css
│   ├── styles.css
│── views/
│   ├── admin.ejs
│   ├── view.ejs
│── index.js
│── README.md
```

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- MongoDB Atlas (or a local MongoDB instance)

### Setting up MongoDB Atlas
- Register at MongoDB Atlas.
-  Create a new cluster.
- Navigate to Network Access and Add Your IP Address to allow access.
- Get the MongoDB connection string from the database section.

### Clone the Repository
```
git clone https://github.com/VigneshMasna/Results-Portal.git
cd results-portal
```

### Install Dependencies
` npm install express mongodb ejs `

### Run the Application
`node index.js`

## API Endpoints
### Student Result Lookup
- **Endpoint**: GET /submit

- **Query Parameters**:
  - rollnumber (String) – Student Roll Number
  - sem (String) – Semester
  
- **Response**:
  - Displays result if found
  - Redirects to homepage with status=-1 if not found

### Admin Authentication
- **Endpoint**: GET /admin

- **Authentication**:
  - Username: admin
  - Password: admin

-  **Response**:
  - Renders Admin Panel

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas)
- **Frontend**: EJS, HTML, CSS
- **Authentication**: Basic Auth

## Security Considerations
- **MongoDB Credentials**:
  - Ensure the credentials are stored in .env (not hardcoded in source code).

- **Authentication**:
  - Consider implementing more secure authentication (JWT, OAuth, etc.).

- **Input Validation**:
  - Sanitize user inputs to prevent injection attacks.
