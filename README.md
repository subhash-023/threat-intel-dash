# Threat Intelligence dashboard

Cyber Threat Intelligence Dashboard is a full-stack web application that visualizes and manages cybersecurity incident data. It enables users to authenticate securely, view categorized threat instances, and gain insights through interactive charts

## **Features**

* JWT-based authentication with cookie handling

* REST API integration using Express and Prisma

* Dynamic data visualizations (bar and pie charts) using Recharts

* Search, filter, and pagination for threat records

* Expandable threat rows for detailed view

* React-based UI with modular styling

## **Tech Stack**

**Frontend**

ReactJS – Component-based UI library

React Router DOM – Client-side routing

Recharts – Data visualization (Bar and Pie charts)

**Backend**

Node.js & Express – RESTful API server

Prisma ORM – Database access and modeling

JWT (jsonwebtoken) – Authentication with signed tokens

**Database**

PostgreSQL - Relational database (locally hosted)

**Steps to run**

Before following below steps, set up local postgreSQL database and note down it's connection url
Example format:
postgresql://username:password@hostname:port/database_name

Backend Setup

1. Navigate to backend folder

```bash
cd backend
```

2. Install necessary packages

```bash
npm install
```

3. Create .env file and add two variables 

    a. DATABASE_URL = your local postgreSQL database url
    b. SECRET_KEY = any string

4. Migrate Prisma Schema to the local database

```bash
npx prisma migrate dev
```

5. Ingest database with the CSV data

```bash
node ingest.js
```

6. Start server

```bash
npm start
```
Frontend Setup

7. Navigate to frontend folder

```bash
cd ../frontend
```

8. Install necessary packages

```bash
npm install
```

9. Create .env file in frontend folder and create a variable VITE_API_BASE_URL and assign it the server's url(http://localhost:3000)

10. Run application 

```bash
npm run dev
```