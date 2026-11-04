# NetServe

**Broadband Subscriber and Service Management Portal**

NetServe is a full stack web application for an internet service provider to manage subscribers, internet plans, billing, and customer support in one place. Customers can browse plans, subscribe, pay bills, and raise support tickets, while the admin manages plans, handles tickets, and monitors the business through a dashboard with graphs. Users receive email notifications for important actions such as registration, subscription, payment, and ticket updates.

The backend is a Spring Boot REST API secured with JWT, and the frontend is a React application built with Vite.

> **Status:** In development. Demo scheduled for November 17, 2026.

## Features

1. User registration with a welcome email
2. Secure login using JWT authentication
3. Two user roles, Customer and Admin, with separate access
4. Admin can add, edit, and deactivate internet plans
5. Customers can browse and compare available plans
6. Customers can subscribe to a plan and receive a confirmation email
7. Customers can request a plan upgrade or downgrade
8. Customers can view their current subscription details
9. Automatic bill generation when a customer subscribes or changes plan
10. Customers can view and pay pending bills, with a payment confirmation email
11. Customers can view their payment history
12. Customers can raise support tickets
13. Admin can view all tickets and update their status, with an email sent to the customer on each update
14. Customers can track the status of their tickets
15. Admin dashboard with graphs showing subscribers per plan and monthly revenue
16. Users can view and update their profile

## Tech Stack

| Layer | Technologies |
|---|---|
| Backend | Java, Spring Boot 4, Spring MVC, Spring Data JPA, Hibernate, Spring Security, JWT, JavaMailSender, Lombok, Maven |
| Frontend | React, Vite, React Router, Axios, Bootstrap, Chart.js |
| Database | PostgreSQL |
| API Testing | Postman, Swagger (OpenAPI), JUnit, Mockito |
| Deployment | Vercel (frontend), Render (backend), Neon (database) |

## Project Structure

```
netserve/
├── backend/     Spring Boot REST API
└── frontend/    React application (Vite)
```

## Getting Started

### Prerequisites

Make sure these are installed on your machine:

| Tool | Version |
|---|---|
| JDK | 17 or higher |
| Node.js | 20 or higher |
| PostgreSQL | 15 or higher |
| Maven | Included through the Maven wrapper |

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/netserve.git
cd netserve
```

### 2. Set up the database

Create a PostgreSQL database named `netserve`:

```sql
CREATE DATABASE netserve;
```

Tables are created automatically by Hibernate when the backend starts.

### 3. Configure the backend

Open `backend/src/main/resources/application.properties` and update the database credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/netserve
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

### 4. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

The API runs at `http://localhost:8080`.

### 5. Run the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## API Documentation

Once the backend is running, the Swagger UI is available at:

```
http://localhost:8080/swagger-ui.html
```

A Postman collection with all endpoints will be added to the repository.

## Database Design

The main tables are `users`, `plans`, `subscriptions`, `bills`, and `tickets`. A customer can have many subscriptions, bills, and tickets, and each subscription belongs to one plan.

## Author

**Samir Husen**
Master's student in Computer Science, Wright State University
