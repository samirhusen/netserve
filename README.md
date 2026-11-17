# NetServe

**Broadband Subscriber and Service Management Portal**

NetServe is a full stack web application that an internet service provider (ISP) can use to run its customer side business in one place. Customers browse internet plans, subscribe, upgrade or downgrade, pay their bills, and raise support tickets. Administrators manage the plan catalog, resolve tickets, and watch the business through a dashboard with live graphs. Every important action sends the customer an email.

The backend is a Spring Boot REST API secured with JSON Web Tokens (JWT), the frontend is a React single page application, and all data is stored in PostgreSQL. The application is deployed on Vercel (frontend), Render (backend) and Neon (database).

---

## Table of Contents

1. [Project Links](#1-project-links)
2. [Project Overview](#2-project-overview)
3. [Features](#3-features)
4. [Screenshots](#4-screenshots)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture](#6-system-architecture)
7. [Authentication and Security](#7-authentication-and-security)
8. [Business Workflows](#8-business-workflows)
9. [Database Design](#9-database-design)
10. [API Reference](#10-api-reference)
11. [Frontend Application](#11-frontend-application)
12. [Project Structure](#12-project-structure)
13. [Prerequisites](#13-prerequisites)
14. [Local Setup Guide](#14-local-setup-guide)
15. [Configuration Reference](#15-configuration-reference)
16. [Testing](#16-testing)
17. [QA Test Plan](#17-qa-test-plan)
18. [Deployment Guide](#18-deployment-guide)
19. [Troubleshooting](#19-troubleshooting)
20. [Project Timeline](#20-project-timeline)
21. [Design Decisions](#21-design-decisions)
22. [Known Limitations and Future Improvements](#22-known-limitations-and-future-improvements)
23. [Author](#23-author)

---

## 1. Project Links

### Live (production)

| What | URL |
|---|---|
| Web application | https://netserve-frontend.vercel.app |
| Backend API base | https://netserve-7yhs.onrender.com |
| Swagger UI (interactive API docs) | https://netserve-7yhs.onrender.com/swagger-ui.html |
| OpenAPI specification (JSON) | https://netserve-7yhs.onrender.com/v3/api-docs |
| Health check | https://netserve-7yhs.onrender.com/actuator/health |
| Public plans endpoint | https://netserve-7yhs.onrender.com/api/plans |
| Source code | https://github.com/samirhusen/netserve |

Anyone can create a customer account from the sign up page and try the complete customer journey. Admin access is available on request.

> The backend runs on Render's free plan, which sleeps after 15 minutes without traffic. The first request after that can take up to a minute. Opening the health check link first is a quick way to wake it up.

### Live application pages

| Page | URL | Who can open it |
|---|---|---|
| Home | https://netserve-frontend.vercel.app/ | Everyone |
| Plans | https://netserve-frontend.vercel.app/plans | Everyone |
| Sign up | https://netserve-frontend.vercel.app/register | Guests |
| Log in | https://netserve-frontend.vercel.app/login | Guests |
| Customer dashboard | https://netserve-frontend.vercel.app/dashboard | Customer |
| Bills and payments | https://netserve-frontend.vercel.app/bills | Customer |
| Support tickets | https://netserve-frontend.vercel.app/tickets | Customer |
| Profile | https://netserve-frontend.vercel.app/profile | Any logged in user |
| Admin dashboard | https://netserve-frontend.vercel.app/admin | Admin |
| Manage plans | https://netserve-frontend.vercel.app/admin/plans | Admin |
| All subscriptions | https://netserve-frontend.vercel.app/admin/subscriptions | Admin |
| All bills | https://netserve-frontend.vercel.app/admin/bills | Admin |
| Ticket management | https://netserve-frontend.vercel.app/admin/tickets | Admin |

### Local development

| What | URL or address |
|---|---|
| Web application (Vite dev server) | http://localhost:5173 |
| Backend API base | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| OpenAPI specification | http://localhost:8080/v3/api-docs |
| Health check | http://localhost:8080/actuator/health |
| Public plans endpoint | http://localhost:8080/api/plans |
| PostgreSQL | host `localhost`, port `5432`, database `netserve`, user `postgres` |

### Hosting platforms

| Part | Platform | Details |
|---|---|---|
| Frontend | Vercel | Project `netserve-frontend`, root directory `frontend`, builds automatically on every push to `main` |
| Backend | Render | Web service built from `backend/Dockerfile`, free instance, region Ohio (US East) |
| Database | Neon | Serverless PostgreSQL, project `netserve`, database `neondb`, region AWS US East, SSL required |
| Code | GitHub | https://github.com/samirhusen/netserve, branch `main` |

---

## 2. Project Overview

### The problem

A broadband provider has to manage hundreds of subscribers, several internet plans, recurring bills, and a steady flow of support requests. When these live in spreadsheets, emails and phone calls, customers cannot see their own account, billing mistakes happen, and support requests get lost.

### The solution

NetServe gives each side of the business its own portal:

| Role | What they can do |
|---|---|
| **Guest** | View the home page and compare all active plans |
| **Customer** | Register, subscribe, change plan, see bills, pay, track payments, raise and follow support tickets, update profile |
| **Admin** | See business statistics and graphs, manage the plan catalog, review all subscriptions and bills, resolve support tickets |

### Background

The project idea comes from real experience working at an ISP (WorldLink Communications, Nepal), so the workflows mirror how a broadband company actually handles plans, billing and support.

### Scope

The project was built as a capstone in about three weeks with these mandatory requirements, all of which are met:

* At least 15 functionalities (16 delivered)
* Email notifications
* At least one graph (two delivered)
* REST API tested with Postman and documented with Swagger
* Relational database
* Deployment to the cloud

---

## 3. Features

### Customer features

| # | Feature | Where |
|---|---|---|
| 1 | Register an account and receive a welcome email | `/register` |
| 2 | Log in securely with JWT | `/login` |
| 3 | Browse and compare plans by speed, data and price | `/plans` |
| 4 | Subscribe to a plan and receive a confirmation email | `/plans` |
| 5 | Upgrade or downgrade to a different plan | `/plans` |
| 6 | See the current plan, start date, renewal date and days left | `/dashboard` |
| 7 | See the full subscription history | `/dashboard` |
| 8 | Get a bill automatically on every subscription or plan change | automatic |
| 9 | Pay a pending bill and receive a receipt email | `/bills` |
| 10 | See payment history and totals | `/bills` |
| 11 | Raise a support ticket with category and priority | `/tickets` |
| 12 | Track ticket status and read the support team's remark | `/tickets` |
| 13 | View and update profile details | `/profile` |

### Admin features

| # | Feature | Where |
|---|---|---|
| 14 | Dashboard with total customers, active subscriptions, open tickets and total revenue | `/admin` |
| 15 | Bar graph of active subscribers per plan and line graph of monthly revenue (last six months) | `/admin` |
| 16 | Create, edit, activate and deactivate plans | `/admin/plans` |
| 17 | View, filter and search all support tickets | `/admin/tickets` |
| 18 | Update ticket status with a remark that is emailed to the customer | `/admin/tickets` |
| 19 | View all subscriptions with status filter and search | `/admin/subscriptions` |
| 20 | View all bills with totals collected and outstanding | `/admin/bills` |

### Email notifications

| Trigger | Email subject |
|---|---|
| Registration | Welcome to NetServe |
| New subscription | Your NetServe subscription is active |
| Plan change | Your NetServe plan was changed |
| Bill payment | Payment received for bill #ID |
| Admin updates a ticket | Update on your support ticket #ID |

### Quality and security features

* Role based access control enforced on both backend and frontend
* Passwords stored as BCrypt hashes, never in plain text
* Customers can only see and act on their own bills, subscriptions and tickets
* Validation on every input with readable error messages
* Emails sent in the background so they never slow down or break a request
* Unit tests for the core business rules
* Health check endpoint for monitoring
* All secrets supplied through environment variables

---

## 4. Screenshots

| Home | Plans |
|---|---|
| ![Home](docs/screenshots/home.png) | ![Plans](docs/screenshots/plans.png) |

| Customer dashboard | Bills |
|---|---|
| ![Customer dashboard](docs/screenshots/customer-dashboard.png) | ![Bills](docs/screenshots/bills.png) |

| Admin dashboard | Ticket management |
|---|---|
| ![Admin dashboard](docs/screenshots/admin-dashboard.png) | ![Admin tickets](docs/screenshots/admin-tickets.png) |

---

## 5. Technology Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Java | 17 (compiled target), JDK 17 or newer to run | Language |
| Spring Boot | 4.1.x | Application framework and auto configuration |
| Spring MVC | 7.x | REST controllers |
| Spring Data JPA | 4.1.x | Repositories and queries |
| Hibernate ORM | 7.x | Object relational mapping, automatic table creation |
| Spring Security | 7.x | Authentication, authorization, password hashing |
| JJWT | 0.12.6 | Creating and validating JSON Web Tokens |
| Jakarta Bean Validation | 3.x | Request validation (`@NotBlank`, `@Email`, `@Positive`) |
| Spring Mail (JavaMailSender) | | Sending email through SMTP |
| Spring Boot Actuator | | Health check endpoint |
| springdoc OpenAPI | 3.x | Swagger UI and OpenAPI specification |
| Lombok | | Removes boilerplate (getters, setters, builders, constructors) |
| PostgreSQL JDBC driver | 42.7.x | Database connection |
| HikariCP | 7.x | Connection pool (included with Spring Boot) |
| Maven | via wrapper `mvnw` | Build and dependency management |
| JUnit 5, Mockito, AssertJ | | Unit testing |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | User interface |
| Vite | 8 | Development server and production build |
| React Router DOM | 7 | Page routing and route protection |
| Axios | 1.x | HTTP client with JWT interceptor |
| Bootstrap | 5.3 | Layout and styling |
| Chart.js | 4 | Graph engine |
| react-chartjs-2 | 5 | React wrapper for Chart.js |
| ESLint / Oxlint | | Code quality checks |

### Database and infrastructure

| Technology | Purpose |
|---|---|
| PostgreSQL 15 or newer | Relational database (local) |
| Neon | Managed PostgreSQL in production |
| Docker | Packages the backend for Render |
| Render | Hosts the backend |
| Vercel | Hosts the frontend |
| Gmail SMTP | Sends emails (local development) |
| GitHub | Source control and deployment trigger |

### Tools used during development

IntelliJ IDEA (backend), VS Code (frontend), pgAdmin 4 (database), Postman (API testing), Google Chrome DevTools (debugging), Git.

---

## 6. System Architecture

### High level view

```mermaid
flowchart LR
    U[User in browser] --> F[React frontend<br/>Vercel]
    F -- "HTTPS + JSON<br/>Authorization: Bearer JWT" --> B[Spring Boot REST API<br/>Render, Docker]
    B -- "JDBC over SSL" --> D[(PostgreSQL<br/>Neon)]
    B -. "async" .-> E[Email service<br/>SMTP]
    E -.-> I[Customer inbox]
```

### Backend layers

```mermaid
flowchart TB
    C["Controller layer<br/>receives HTTP requests, validates DTOs"] --> S["Service layer<br/>business rules and transactions"]
    S --> R["Repository layer<br/>Spring Data JPA"]
    R --> DB[("PostgreSQL")]
    S -.-> M["EmailService<br/>runs asynchronously"]
    J["JwtAuthFilter<br/>runs before every controller"] -.-> C
    X["GlobalExceptionHandler<br/>turns exceptions into JSON errors"] -.-> C
```

| Layer | Package | Responsibility |
|---|---|---|
| Security | `security`, `config` | Read the JWT, load the user, decide who can call which endpoint |
| Controller | `controller` | Map URLs to methods, validate input, return HTTP status codes |
| DTO | `dto` | Define exactly what goes in and out of the API |
| Service | `service` | Business rules, transactions, calling email |
| Repository | `repository` | Database queries through Spring Data JPA |
| Entity | `entity` | Java classes mapped to database tables |
| Exception | `exception` | Custom exceptions and the global error handler |

### What happens on a typical request

1. The React page calls the API through the shared Axios instance.
2. Axios adds the `Authorization: Bearer <token>` header automatically.
3. Spring's CORS filter checks that the request comes from an allowed frontend address.
4. `JwtAuthFilter` validates the token and puts the logged in user into the security context.
5. Spring Security checks the URL rules (public, logged in, or admin only).
6. The controller validates the request body and calls the service.
7. The service applies the business rules inside a transaction and uses repositories to read and write data.
8. The service maps entities to response DTOs, and the controller returns JSON.
9. If an email is needed, it is sent on a background thread after the response is already on its way.
10. Any error is turned into a clean JSON message by `GlobalExceptionHandler`.

---

## 7. Authentication and Security

### Login flow

```mermaid
sequenceDiagram
    participant UI as React app
    participant API as Spring Boot API
    participant DB as PostgreSQL

    UI->>API: POST /api/auth/login {email, password}
    API->>DB: find user by email
    DB-->>API: user with BCrypt hash
    API->>API: compare password with BCrypt
    API-->>UI: 200 {token, id, fullName, email, role}
    UI->>UI: save token and user in localStorage

    UI->>API: GET /api/bills (Authorization: Bearer token)
    API->>API: JwtAuthFilter validates signature and expiry
    API->>DB: load bills for this user only
    API-->>UI: 200 [bills]
```

### Security rules

| Rule | How it is implemented |
|---|---|
| Passwords are never stored in plain text | `BCryptPasswordEncoder` hashes them on registration |
| Stateless sessions | `SessionCreationPolicy.STATELESS`; the server keeps no session, the JWT carries identity |
| Token contents | Subject is the user's email, plus a `role` claim, issued at and expiry times |
| Token signing | HMAC SHA key built from the Base64 `JWT_SECRET` |
| Token lifetime | 24 hours (`jwt.expiration=86400000` milliseconds) |
| Public endpoints | `/api/auth/**`, `GET /api/plans/**`, Swagger, `/actuator/health`, `/error` |
| Admin endpoints | Everything under `/api/admin/**` requires role `ADMIN` |
| Everything else | Requires a valid token |
| Data ownership | Services check that a bill or ticket belongs to the logged in user; otherwise they answer "not found" so nothing leaks |
| Missing or invalid token | `401 Unauthorized` |
| Wrong role | `403 Forbidden` |
| CSRF | Disabled, because the API uses tokens in headers, not cookies |
| CORS | Only origins listed in `FRONTEND_URL` may call the API from a browser |
| Secrets | Database, JWT and email credentials come from environment variables, never from the code |
| Actuator | Only the `health` endpoint is exposed, with details hidden |

### Frontend protection

* `ProtectedRoute` sends logged out users to `/login` and sends users with the wrong role to their own dashboard.
* `GuestRoute` keeps logged in users away from the login and sign up pages.
* An Axios response interceptor logs the user out and returns them to the login page when the token expires.

---

## 8. Business Workflows

### Subscription and billing

```mermaid
flowchart TD
    A[Customer picks a plan] --> B{Already has an<br/>ACTIVE subscription?}
    B -- No --> C[Create ACTIVE subscription<br/>start today, end today + validity days]
    B -- "Yes, subscribe" --> X[Rejected: use change plan]
    B -- "Yes, change plan" --> D{Same plan?}
    D -- Yes --> Y[Rejected: already on this plan]
    D -- No --> E[Old subscription becomes CANCELLED<br/>end date set to today]
    E --> C
    C --> F[Create PENDING bill<br/>amount = plan price, due in 7 days]
    F --> G[Email confirmation]
    G --> H[Customer pays bill]
    H --> I[Bill becomes PAID, paidAt recorded]
    I --> J[Email receipt]
```

| Rule | Detail |
|---|---|
| One active plan per customer | Subscribing again is rejected; customers change plan instead |
| Only active plans can be chosen | Deactivated plans are rejected |
| Subscription length | `validityDays` of the plan (30 days for the seeded plans) |
| Bill amount | The plan price at the time of subscribing |
| Bill due date | 7 days after it is issued |
| Plan change | Cancels the old subscription and creates a new subscription and bill |
| Paying | Only the bill's owner can pay it, and only once |
| Upgrade or downgrade label | Decided in the UI by comparing the new plan's price with the current one |

### Support ticket lifecycle

```mermaid
stateDiagram-v2
    [*] --> OPEN: customer creates ticket
    OPEN --> IN_PROGRESS: admin starts work
    OPEN --> RESOLVED
    IN_PROGRESS --> RESOLVED: issue fixed
    RESOLVED --> CLOSED: admin closes
    IN_PROGRESS --> CLOSED
    OPEN --> CLOSED
    CLOSED --> [*]
```

Every admin update emails the customer with the new status and remark. Closed tickets cannot be changed again. Open tickets for the dashboard count are tickets with status `OPEN` or `IN_PROGRESS`.

### Plan management

Plans are never deleted. Deactivating a plan hides it from customers but keeps the history of every subscription and bill that used it. It can be activated again at any time.

### Dashboard statistics

| Statistic | How it is calculated |
|---|---|
| Customers | Users with role `CUSTOMER` |
| Active subscriptions | Subscriptions with status `ACTIVE` |
| Open tickets | Tickets with status `OPEN` or `IN_PROGRESS` |
| Total revenue | Sum of all `PAID` bills |
| Subscribers per plan | Active subscriptions grouped by plan name (JPQL `GROUP BY`) |
| Monthly revenue | Paid bills grouped by the month of `paidAt`, for the last six months, including months with zero revenue |

### Seed data

On the first start, `DataSeeder` creates a default administrator account and three sample plans. The admin's password should be changed in any public deployment.

| Plan | Speed | Data | Price | Validity |
|---|---|---|---|---|
| Basic | 50 Mbps | 500 GB | $29.99 | 30 days |
| Standard | 200 Mbps | Unlimited | $49.99 | 30 days |
| Premium | 1000 Mbps (1 Gbps) | Unlimited | $79.99 | 30 days |

---

## 9. Database Design

Tables are created and updated automatically by Hibernate (`spring.jpa.hibernate.ddl-auto=update`) from the entity classes. Column names use Spring's default snake case naming.

### Entity relationship diagram

```mermaid
erDiagram
    USERS ||--o{ SUBSCRIPTIONS : "has"
    USERS ||--o{ BILLS : "receives"
    USERS ||--o{ TICKETS : "raises"
    PLANS ||--o{ SUBSCRIPTIONS : "is chosen in"
    SUBSCRIPTIONS ||--o{ BILLS : "generates"

    USERS {
        bigint id PK
        varchar full_name
        varchar email UK
        varchar password
        varchar phone
        varchar address
        varchar role
        timestamp created_at
    }
    PLANS {
        bigint id PK
        varchar name
        int speed_mbps
        int data_limit_gb
        numeric price
        int validity_days
        varchar description
        boolean active
        timestamp created_at
    }
    SUBSCRIPTIONS {
        bigint id PK
        bigint user_id FK
        bigint plan_id FK
        date start_date
        date end_date
        varchar status
    }
    BILLS {
        bigint id PK
        bigint user_id FK
        bigint subscription_id FK
        numeric amount
        date issue_date
        date due_date
        varchar status
        timestamp paid_at
    }
    TICKETS {
        bigint id PK
        bigint user_id FK
        varchar subject
        varchar description
        varchar category
        varchar priority
        varchar status
        varchar admin_remark
        timestamp created_at
        timestamp updated_at
    }
```

### `users`

Stores both customers and administrators. The table is called `users` because `user` is a reserved word in PostgreSQL.

| Column | Type | Rules | Description |
|---|---|---|---|
| `id` | bigint | primary key, auto increment | Unique user ID |
| `full_name` | varchar(255) | required | Display name |
| `email` | varchar(255) | required, unique | Login email |
| `password` | varchar(255) | required | BCrypt hash, never plain text |
| `phone` | varchar(255) | optional | Contact number |
| `address` | varchar(255) | optional | Service address |
| `role` | varchar(255) | required, `CUSTOMER` or `ADMIN` | Access level |
| `created_at` | timestamp | set automatically, never updated | Registration time |

### `plans`

| Column | Type | Rules | Description |
|---|---|---|---|
| `id` | bigint | primary key | Unique plan ID |
| `name` | varchar(255) | required | Plan name |
| `speed_mbps` | integer | required, positive | Download speed in Mbps |
| `data_limit_gb` | integer | optional, positive | Monthly data cap; `NULL` means unlimited |
| `price` | numeric(10,2) | required, greater than 0 | Price per billing cycle in USD |
| `validity_days` | integer | required, positive | Length of one billing cycle |
| `description` | varchar(500) | optional | Marketing text |
| `active` | boolean | required, default `true` | Inactive plans are hidden from customers |
| `created_at` | timestamp | set automatically | Creation time |

### `subscriptions`

| Column | Type | Rules | Description |
|---|---|---|---|
| `id` | bigint | primary key | Unique subscription ID |
| `user_id` | bigint | foreign key to `users.id`, required | The customer |
| `plan_id` | bigint | foreign key to `plans.id`, required | The chosen plan |
| `start_date` | date | required | First day of service |
| `end_date` | date | required | Renewal date, or the cancellation date if changed |
| `status` | varchar(255) | `ACTIVE`, `CANCELLED`, `EXPIRED` | Current state |

### `bills`

| Column | Type | Rules | Description |
|---|---|---|---|
| `id` | bigint | primary key | Bill number |
| `user_id` | bigint | foreign key to `users.id`, required | The customer who owes it |
| `subscription_id` | bigint | foreign key to `subscriptions.id`, required | The subscription it charges for |
| `amount` | numeric(10,2) | required | Amount in USD |
| `issue_date` | date | required | Date the bill was created |
| `due_date` | date | required | Issue date plus 7 days |
| `status` | varchar(255) | `PENDING` or `PAID` | Payment state |
| `paid_at` | timestamp | set when paid | Payment time |

### `tickets`

| Column | Type | Rules | Description |
|---|---|---|---|
| `id` | bigint | primary key | Ticket number |
| `user_id` | bigint | foreign key to `users.id`, required | The customer who raised it |
| `subject` | varchar(255) | required | Short summary |
| `description` | varchar(1000) | required | Full details |
| `category` | varchar(255) | required | Connectivity, Slow speed, Billing, Installation, Account, Other |
| `priority` | varchar(255) | `LOW`, `MEDIUM`, `HIGH` | Urgency |
| `status` | varchar(255) | `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` | Progress |
| `admin_remark` | varchar(1000) | optional | Latest reply from the support team |
| `created_at` | timestamp | set automatically | Creation time |
| `updated_at` | timestamp | updated automatically | Last change time |

### Enums

| Enum | Values |
|---|---|
| `Role` | `CUSTOMER`, `ADMIN` |
| `SubscriptionStatus` | `ACTIVE`, `CANCELLED`, `EXPIRED` |
| `BillStatus` | `PENDING`, `PAID` |
| `TicketStatus` | `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` |
| `TicketPriority` | `LOW`, `MEDIUM`, `HIGH` |

Enums are stored as text (`@Enumerated(EnumType.STRING)`) so the database stays readable and reordering an enum never corrupts data.

### Useful SQL for inspecting data

```sql
-- Customers and their current plan
SELECT u.full_name, u.email, p.name AS plan, s.status, s.end_date
FROM users u
JOIN subscriptions s ON s.user_id = u.id
JOIN plans p ON p.id = s.plan_id
WHERE s.status = 'ACTIVE';

-- Outstanding bills
SELECT b.id, u.full_name, b.amount, b.due_date
FROM bills b JOIN users u ON u.id = b.user_id
WHERE b.status = 'PENDING';

-- Ticket counts by status
SELECT status, COUNT(*) FROM tickets GROUP BY status;
```

---

## 10. API Reference

Base URL locally is `http://localhost:8080`, and in production `https://netserve-7yhs.onrender.com`. All request and response bodies are JSON. Protected endpoints require the header:

```
Authorization: Bearer <token from login>
```

### Endpoint summary

| # | Method | Endpoint | Access | Description | Success |
|---|---|---|---|---|---|
| 1 | POST | `/api/auth/register` | Public | Register a customer | 201 |
| 2 | POST | `/api/auth/login` | Public | Log in, receive JWT | 200 |
| 3 | GET | `/api/plans` | Public | List active plans | 200 |
| 4 | GET | `/api/plans/{id}` | Public | Get one plan | 200 |
| 5 | GET | `/api/users/me` | Logged in | My profile | 200 |
| 6 | PUT | `/api/users/me` | Logged in | Update my profile | 200 |
| 7 | POST | `/api/subscriptions` | Logged in | Subscribe to a plan | 201 |
| 8 | PUT | `/api/subscriptions/change` | Logged in | Upgrade or downgrade | 200 |
| 9 | GET | `/api/subscriptions/current` | Logged in | Current subscription (204 if none) | 200 or 204 |
| 10 | GET | `/api/subscriptions` | Logged in | My subscription history | 200 |
| 11 | GET | `/api/bills` | Logged in | My bills | 200 |
| 12 | GET | `/api/bills/payments` | Logged in | My paid bills | 200 |
| 13 | POST | `/api/bills/{id}/pay` | Logged in | Pay one of my bills | 200 |
| 14 | POST | `/api/tickets` | Logged in | Create a ticket | 201 |
| 15 | GET | `/api/tickets` | Logged in | My tickets | 200 |
| 16 | GET | `/api/tickets/{id}` | Logged in | One of my tickets | 200 |
| 17 | GET | `/api/admin/dashboard` | Admin | Statistics and graph data | 200 |
| 18 | GET | `/api/admin/plans` | Admin | All plans, including inactive | 200 |
| 19 | POST | `/api/admin/plans` | Admin | Create a plan | 201 |
| 20 | PUT | `/api/admin/plans/{id}` | Admin | Update a plan | 200 |
| 21 | PATCH | `/api/admin/plans/{id}/toggle` | Admin | Activate or deactivate a plan | 200 |
| 22 | GET | `/api/admin/subscriptions` | Admin | All subscriptions | 200 |
| 23 | GET | `/api/admin/bills` | Admin | All bills | 200 |
| 24 | GET | `/api/admin/tickets` | Admin | All tickets | 200 |
| 25 | PATCH | `/api/admin/tickets/{id}/status` | Admin | Update ticket status and remark | 200 |
| 26 | GET | `/actuator/health` | Public | Application and database health | 200 |

### Request and response examples

**Register** `POST /api/auth/register`

```json
{
  "fullName": "Jane Customer",
  "email": "jane@example.com",
  "password": "secret123",
  "phone": "9370000000",
  "address": "Fairborn, Ohio"
}
```

Validation: `fullName` required, `email` required and valid, `password` at least 6 characters, `phone` and `address` optional.

**Login** `POST /api/auth/login`

```json
{ "email": "jane@example.com", "password": "secret123" }
```

Response for both register and login:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "id": 2,
  "fullName": "Jane Customer",
  "email": "jane@example.com",
  "role": "CUSTOMER"
}
```

**Plan** (response of `/api/plans`)

```json
{
  "id": 2,
  "name": "Standard",
  "speedMbps": 200,
  "dataLimitGb": null,
  "price": 49.99,
  "validityDays": 30,
  "description": "Unlimited data for families and HD streaming",
  "active": true
}
```

**Create or update a plan** `POST /api/admin/plans`, `PUT /api/admin/plans/{id}`

```json
{
  "name": "Student",
  "speedMbps": 100,
  "dataLimitGb": 300,
  "price": 19.99,
  "validityDays": 30,
  "description": "Affordable plan for students"
}
```

Validation: `name` required; `speedMbps`, `price` and `validityDays` required and positive; `dataLimitGb` optional and positive (`null` means unlimited); `description` up to 500 characters.

**Subscribe or change plan** `POST /api/subscriptions`, `PUT /api/subscriptions/change`

```json
{ "planId": 2 }
```

Response:

```json
{
  "id": 5,
  "planId": 2,
  "planName": "Standard",
  "speedMbps": 200,
  "price": 49.99,
  "startDate": "2026-11-17",
  "endDate": "2026-12-17",
  "status": "ACTIVE",
  "customerName": "Jane Customer",
  "customerEmail": "jane@example.com"
}
```

**Bill** (response of `/api/bills` and `/api/bills/{id}/pay`)

```json
{
  "id": 8,
  "subscriptionId": 5,
  "planName": "Standard",
  "amount": 49.99,
  "issueDate": "2026-11-17",
  "dueDate": "2026-11-24",
  "status": "PAID",
  "paidAt": "2026-11-17T14:32:10.512",
  "customerName": "Jane Customer"
}
```

**Create a ticket** `POST /api/tickets`

```json
{
  "subject": "Internet keeps disconnecting",
  "description": "My connection drops every evening around 8 PM.",
  "category": "Connectivity",
  "priority": "HIGH"
}
```

Validation: `subject`, `description` (up to 1000 characters), `category` and `priority` (`LOW`, `MEDIUM`, `HIGH`) are required. New tickets start as `OPEN`.

**Update a ticket (admin)** `PATCH /api/admin/tickets/{id}/status`

```json
{ "status": "IN_PROGRESS", "adminRemark": "Technician assigned to check your line." }
```

**Update profile** `PUT /api/users/me`

```json
{ "fullName": "Jane Customer", "phone": "9371112222", "address": "Dayton, Ohio" }
```

Email cannot be changed because it is the login ID.

**Dashboard (admin)** `GET /api/admin/dashboard`

```json
{
  "totalCustomers": 3,
  "activeSubscriptions": 3,
  "openTickets": 1,
  "totalRevenue": 159.97,
  "subscribersPerPlan": [
    { "plan": "Basic", "subscribers": 1 },
    { "plan": "Standard", "subscribers": 2 }
  ],
  "monthlyRevenue": [
    { "month": "Jun 2026", "revenue": 0 },
    { "month": "Nov 2026", "revenue": 159.97 }
  ]
}
```

**Health** `GET /actuator/health`

```json
{ "status": "UP" }
```

It reports `DOWN` when the database is unreachable.

### Error responses

| Status | When | Body |
|---|---|---|
| 400 | Business rule broken, for example paying a paid bill | `{ "message": "This bill is already paid" }` |
| 400 | Validation failed | `{ "email": "Email is invalid", "password": "Password must be at least 6 characters" }` |
| 401 | Wrong email or password at login | `{ "message": "Invalid email or password" }` |
| 401 | Missing, invalid or expired token | empty body |
| 403 | Logged in but wrong role, for example a customer calling `/api/admin/**` | empty or default body |
| 404 | Resource not found, or it belongs to someone else | `{ "message": "Bill not found" }` |

### Main business error messages

| Message | Cause |
|---|---|
| Email is already registered | Registering with an existing email |
| You already have an active subscription. Use change plan instead. | Subscribing twice |
| You do not have an active subscription | Changing plan without one |
| You are already on this plan | Changing to the same plan |
| This plan is not available | Choosing a deactivated plan |
| This bill is already paid | Paying twice |
| Closed tickets cannot be updated | Admin editing a closed ticket |

### Swagger

Open `/swagger-ui.html`, call `POST /api/auth/login`, copy the `token` from the response, click **Authorize**, paste the token and confirm. Every protected endpoint can then be tried directly from the browser.

### Postman

The repository contains `NetServe.postman_collection.json` with all endpoints organised in folders: Auth, Users, Plans (Public), Admin Plans, Subscriptions, Bills, Tickets and Admin.

1. In Postman, click **Import** and select the file.
2. Open the collection's **Variables** tab and fill in `baseUrl` (local or production) and the login email and password values.
3. Run **Login Customer** and **Login Admin** first. Their test scripts save `customerToken` and `adminToken` automatically.
4. Every other request already uses the right token. **Get My Bills** saves the first pending bill ID and **Create Ticket** saves the new ticket ID, so **Pay Bill** and the ticket requests work straight after them.
5. The request **Create Plan as Customer (expect 403)** proves that customers cannot reach admin endpoints.

---

## 11. Frontend Application

### Routes

| Path | Page component | Access | What it shows |
|---|---|---|---|
| `/` | `HomePage` | Everyone | Hero section and key features |
| `/plans` | `PlansPage` | Everyone | Plan cards; Subscribe, Upgrade, Downgrade or Current plan buttons depending on the user |
| `/login` | `LoginPage` | Guests | Login form; redirects by role afterwards |
| `/register` | `RegisterPage` | Guests | Sign up form with field level errors |
| `/dashboard` | `DashboardPage` | Customer | Current plan, amount due, open tickets, pending bills, subscription history |
| `/bills` | `BillsPage` | Customer | Amount due and total paid, All bills tab with Pay now, Payment history tab |
| `/tickets` | `TicketsPage` | Customer | New ticket form and list of my tickets with status and remarks |
| `/profile` | `ProfilePage` | Logged in | Profile details and edit form |
| `/admin` | `AdminDashboardPage` | Admin | Four statistic cards, bar graph and line graph |
| `/admin/plans` | `AdminPlansPage` | Admin | Plan table, add and edit form, activate and deactivate |
| `/admin/subscriptions` | `AdminSubscriptionsPage` | Admin | All subscriptions with filter and search |
| `/admin/bills` | `AdminBillsPage` | Admin | All bills with totals and filter |
| `/admin/tickets` | `AdminTicketsPage` | Admin | Ticket filters with counts, search, status update form |
| any other | `NotFoundPage` | Everyone | 404 page |

### How the frontend works

| Part | File | Role |
|---|---|---|
| API client | `src/api/axios.js` | One Axios instance using `VITE_API_URL`; request interceptor adds the JWT; response interceptor logs out on 401; helpers turn backend errors into readable messages |
| Auth state | `src/context/AuthProvider.jsx` | Holds the logged in user, saves the token in `localStorage` so a refresh keeps the session, provides `login`, `register`, `logout`, `updateUser` |
| Auth hook | `src/context/useAuth.js` | Lets any component read `user`, `isAdmin`, `isCustomer` |
| Route guards | `src/components/ProtectedRoute.jsx` | `ProtectedRoute` and `GuestRoute` |
| Shared UI | `src/components/ui.jsx` | Status badges, loading spinner, alerts, page header, statistic cards, empty state |
| Navigation | `src/components/Navbar.jsx` | Different links for guests, customers and admins, mobile menu |
| Formatting | `src/utils/format.js` | Money, dates (time zone safe), speed, data limits, days remaining |
| Graphs | `AdminDashboardPage.jsx` | Chart.js bar and line charts fed by `/api/admin/dashboard` |
| Styling | `src/index.css` | NetServe colours, cards, hero, plan cards, chart sizing |

Every data page follows the same pattern: load data in `useEffect`, keep `loading`, `error` and `success` in state, and after any action call the API, show a message and reload so the screen always matches the database.

---

## 12. Project Structure

```
netserve/
├── README.md
├── NetServe.postman_collection.json
├── docs/
│   └── screenshots/
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   ├── mvnw, mvnw.cmd, .mvn/
│   └── src/
│       ├── main/
│       │   ├── java/com/netserve/backend/
│       │   │   ├── BackendApplication.java
│       │   │   ├── config/
│       │   │   │   ├── SecurityConfig.java        URL rules, CORS, password encoder
│       │   │   │   ├── OpenApiConfig.java         Swagger with JWT Authorize button
│       │   │   │   ├── AsyncConfig.java           Enables @Async for emails
│       │   │   │   └── DataSeeder.java            Seeds admin account and sample plans
│       │   │   ├── security/
│       │   │   │   ├── JwtService.java            Creates and validates tokens
│       │   │   │   ├── JwtAuthFilter.java         Reads the token on every request
│       │   │   │   └── CustomUserDetailsService.java
│       │   │   ├── controller/
│       │   │   │   ├── AuthController.java
│       │   │   │   ├── UserController.java
│       │   │   │   ├── PlanController.java
│       │   │   │   ├── AdminPlanController.java
│       │   │   │   ├── SubscriptionController.java
│       │   │   │   ├── BillController.java
│       │   │   │   ├── TicketController.java
│       │   │   │   └── AdminController.java
│       │   │   ├── service/
│       │   │   │   ├── AuthService.java
│       │   │   │   ├── UserService.java
│       │   │   │   ├── PlanService.java
│       │   │   │   ├── SubscriptionService.java
│       │   │   │   ├── BillService.java
│       │   │   │   ├── TicketService.java
│       │   │   │   ├── DashboardService.java
│       │   │   │   └── EmailService.java
│       │   │   ├── repository/
│       │   │   │   ├── UserRepository.java
│       │   │   │   ├── PlanRepository.java
│       │   │   │   ├── SubscriptionRepository.java
│       │   │   │   ├── BillRepository.java
│       │   │   │   └── TicketRepository.java
│       │   │   ├── entity/
│       │   │   │   ├── User.java, Plan.java, Subscription.java, Bill.java, Ticket.java
│       │   │   │   └── Role.java, SubscriptionStatus.java, BillStatus.java,
│       │   │   │       TicketStatus.java, TicketPriority.java
│       │   │   ├── dto/
│       │   │   │   ├── RegisterRequest, LoginRequest, AuthResponse, UserResponse,
│       │   │   │   │   UpdateProfileRequest
│       │   │   │   ├── PlanRequest, PlanResponse
│       │   │   │   ├── SubscribeRequest, SubscriptionResponse, BillResponse
│       │   │   │   ├── TicketRequest, TicketStatusUpdateRequest, TicketResponse
│       │   │   │   └── DashboardResponse, PlanCount, MonthlyRevenue
│       │   │   └── exception/
│       │   │       ├── BadRequestException.java
│       │   │       ├── ResourceNotFoundException.java
│       │   │       └── GlobalExceptionHandler.java
│       │   └── resources/
│       │       └── application.properties
│       └── test/java/com/netserve/backend/service/
│           ├── SubscriptionServiceTest.java
│           ├── BillServiceTest.java
│           └── TicketServiceTest.java
└── frontend/
    ├── .env                       VITE_API_URL for local development
    ├── vercel.json                Sends every route to index.html
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx               Loads Bootstrap, wraps app in router and auth provider
        ├── App.jsx                All routes and their protection
        ├── index.css
        ├── api/axios.js
        ├── context/               AuthContext.js, AuthProvider.jsx, useAuth.js
        ├── utils/format.js
        ├── components/            Navbar.jsx, PlanCard.jsx, ProtectedRoute.jsx, ui.jsx
        └── pages/
            ├── HomePage.jsx, LoginPage.jsx, RegisterPage.jsx, PlansPage.jsx
            ├── DashboardPage.jsx, BillsPage.jsx, TicketsPage.jsx, ProfilePage.jsx
            ├── NotFoundPage.jsx
            └── admin/
                ├── AdminDashboardPage.jsx, AdminPlansPage.jsx, AdminTicketsPage.jsx
                └── AdminSubscriptionsPage.jsx, AdminBillsPage.jsx
```

---

## 13. Prerequisites

| Tool | Version | Check with | Install on macOS |
|---|---|---|---|
| JDK | 17 or newer | `java -version` | Download Eclipse Temurin from adoptium.net, or `brew install --cask temurin` |
| Node.js and npm | Node 20 or newer | `node -v` and `npm -v` | Download the LTS installer from nodejs.org, or `brew install node` |
| PostgreSQL | 15 or newer | `psql --version` | Installer from postgresql.org (includes pgAdmin), or `brew install postgresql@15` |
| Git | any recent | `git --version` | Included with Xcode command line tools |
| Maven | not required | | The project includes the Maven wrapper `mvnw` |

Recommended tools: IntelliJ IDEA for the backend, VS Code for the frontend, pgAdmin 4 or DBeaver for the database, Postman for API testing, and Chrome with React Developer Tools.

For email you need a Gmail account with **2 Step Verification** turned on and an **App password** created at Google Account, Security, App passwords.

### Backend dependencies (managed by Maven in `pom.xml`)

`spring-boot-starter-webmvc`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, `spring-boot-starter-validation`, `spring-boot-starter-mail`, `spring-boot-starter-actuator`, `spring-boot-devtools`, `postgresql`, `lombok`, `jjwt-api`, `jjwt-impl`, `jjwt-jackson`, `springdoc-openapi-starter-webmvc-ui`, and the Spring Boot test starter (JUnit 5, Mockito, AssertJ).

### Frontend dependencies (managed by npm in `package.json`)

`react`, `react-dom`, `react-router-dom`, `axios`, `bootstrap`, `chart.js`, `react-chartjs-2`, plus Vite and the React plugin for development.

---

## 14. Local Setup Guide

### Step 1: Clone the repository

```bash
git clone https://github.com/samirhusen/netserve.git
cd netserve
```

### Step 2: Create the database

With psql:

```bash
psql -U postgres -c "CREATE DATABASE netserve;"
```

Or in pgAdmin: right click **Databases**, choose **Create**, then **Database**, name it `netserve`, and save. There is no need to create tables; Hibernate creates them on the first start.

### Step 3: Set the backend environment variables

In IntelliJ, open **Run**, then **Edit Configurations**, select `BackendApplication`, and fill in **Environment variables** (separated by semicolons):

```
DB_PASSWORD=your_postgres_password;JWT_SECRET=your_base64_secret;MAIL_USERNAME=you@gmail.com;MAIL_PASSWORD=your_gmail_app_password
```

Generate a JWT secret with:

```bash
openssl rand -base64 32
```

Or export them in a terminal before running Maven:

```bash
export DB_PASSWORD=your_postgres_password
export JWT_SECRET=$(openssl rand -base64 32)
export MAIL_USERNAME=you@gmail.com
export MAIL_PASSWORD=your_gmail_app_password
```

`DB_URL`, `DB_USERNAME` and `FRONTEND_URL` have local defaults and only need setting if yours differ. See [Configuration Reference](#15-configuration-reference).

### Step 4: Run the backend

In IntelliJ, open `BackendApplication.java` and click the green run button. Or from a terminal:

```bash
cd backend
./mvnw spring-boot:run
```

It is ready when the console shows `Started BackendApplication`. Check it:

* http://localhost:8080/actuator/health shows `{"status":"UP"}`
* http://localhost:8080/api/plans shows the three seeded plans
* http://localhost:8080/swagger-ui.html shows the API documentation

### Step 5: Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The file `frontend/.env` already points the app at the local backend:

```
VITE_API_URL=http://localhost:8080
```

### Step 6: Try it

1. Sign up as a customer with a real email address you can check (Gmail plus addresses such as `you+test1@gmail.com` work well).
2. Subscribe to a plan, upgrade it, pay the bill, and raise a ticket.
3. Log in as the admin account created by `DataSeeder`, look at the graphs, and update the ticket.
4. Check the inbox for the welcome, subscription, payment and ticket update emails.

---

## 15. Configuration Reference

### Backend environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DB_URL` | Production | `jdbc:postgresql://localhost:5432/netserve` | JDBC connection URL |
| `DB_USERNAME` | Production | `postgres` | Database user |
| `DB_PASSWORD` | Yes | none | Database password |
| `JWT_SECRET` | Yes | none | Base64 encoded key of at least 256 bits for signing tokens |
| `MAIL_USERNAME` | Yes | none | Gmail address that sends emails |
| `MAIL_PASSWORD` | Yes | none | Gmail app password (16 characters, no spaces) |
| `FRONTEND_URL` | Production | `http://localhost:5173` | Allowed browser origins for CORS, comma separated |
| `PORT` | Set by Render | `8080` | Port the server listens on |

### `application.properties` settings

| Property | Value | Meaning |
|---|---|---|
| `server.port` | `${PORT:8080}` | Uses the platform port when present |
| `spring.jpa.hibernate.ddl-auto` | `update` | Creates and updates tables from entities |
| `spring.jpa.show-sql` | `true` | Prints SQL to the console for debugging |
| `spring.jpa.open-in-view` | `false` | Database access only inside services, not while writing the response |
| `jwt.expiration` | `86400000` | Token lifetime of 24 hours |
| `spring.mail.host` / `port` | `smtp.gmail.com` / `587` | Gmail SMTP with STARTTLS |
| `app.frontendUrl` | `${FRONTEND_URL:...}` | Source of the CORS origins |
| `management.endpoints.web.exposure.include` | `health` | Only the health endpoint is exposed |
| `management.endpoint.health.show-details` | `never` | Health details stay hidden |

### Frontend environment variable

| Variable | Where | Description |
|---|---|---|
| `VITE_API_URL` | `frontend/.env` locally, Vercel project settings in production | Backend base URL with no trailing slash. Vite builds it into the JavaScript, so it must never hold a secret, and Vercel must redeploy after it changes |

---

## 16. Testing

### Unit tests

Unit tests use **JUnit 5**, **Mockito** and **AssertJ**. Repositories and the email service are replaced with Mockito mocks, so the tests check pure business logic, need no database or environment variables, and run in about a second.

| Test class | Test | What it proves |
|---|---|---|
| `SubscriptionServiceTest` | `subscribe_createsSubscriptionAndPendingBill` | Subscribing creates an ACTIVE subscription ending after the plan's validity, a PENDING bill for the plan price due in 7 days, and sends an email |
| | `subscribe_whenAlreadySubscribed_throws` | A second subscription is rejected and nothing is saved or emailed |
| | `subscribe_toInactivePlan_throws` | Deactivated plans cannot be chosen |
| | `changePlan_toSamePlan_throws` | Changing to the current plan is rejected |
| | `changePlan_cancelsOldAndCreatesNew` | The old subscription is cancelled today, a new one is created, and a new bill uses the new price |
| `BillServiceTest` | `payBill_marksBillPaid` | Paying sets PAID, records `paidAt`, and sends a receipt |
| | `payBill_alreadyPaid_throws` | A paid bill cannot be paid again |
| | `payBill_belongingToAnotherCustomer_throws` | A customer cannot pay someone else's bill |
| `TicketServiceTest` | `updateStatus_updatesTicketAndNotifiesCustomer` | Admin updates change status and remark and email the customer |
| | `updateStatus_onClosedTicket_throws` | Closed tickets cannot be changed |

Run the service tests from the `backend` folder:

```bash
./mvnw test -Dtest="*ServiceTest"
```

Or in IntelliJ, right click `src/test/java/com/netserve/backend/service` and choose **Run 'Tests in service'**.

The generated `BackendApplicationTests.contextLoads()` starts the full application, so it needs a running database and all environment variables. The Docker build skips tests (`-DskipTests`), so deployment never depends on them.

### API testing

* **Postman:** the collection in the repository covers all endpoints, including a negative test proving customers get `403` on admin endpoints. See [Postman](#postman).
* **Swagger:** every endpoint can be tried from `/swagger-ui.html` after clicking **Authorize**. See [Swagger](#swagger).

### Manual testing in the browser

Chrome DevTools is the quickest way to inspect behaviour: the **Network** tab shows each API call with its status and response, and the **Console** shows CORS or connection errors.

---

## 17. QA Test Plan

These end to end cases cover every functionality. Run them on the live site or locally with a fresh customer account.

### Authentication

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| A1 | Register | Fill the sign up form with valid data | Redirected to Plans with a welcome message; welcome email arrives |
| A2 | Register with an existing email | Sign up again with the same email | Error "Email is already registered" |
| A3 | Register with a short password | Password of 5 characters | Error under the password field |
| A4 | Passwords do not match | Different confirm password | Error "Passwords do not match", nothing sent to the server |
| A5 | Log in | Valid email and password | Customer lands on `/dashboard`, admin on `/admin` |
| A6 | Wrong password | Invalid password | Error "Invalid email or password" |
| A7 | Stay logged in | Refresh the page after logging in | Still logged in |
| A8 | Log out | Click Logout | Returned to the login page; protected pages redirect to login |
| A9 | Expired or invalid token | Edit the token in localStorage and reload a protected page | Logged out with "Your session has expired" |

### Access control

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| S1 | Guest opens a protected page | Open `/dashboard` while logged out | Redirected to `/login` |
| S2 | Customer opens admin page | Open `/admin` as a customer | Redirected to `/dashboard` |
| S3 | Admin opens customer page | Open `/bills` as admin | Redirected to `/admin` |
| S4 | Customer calls admin API | `POST /api/admin/plans` with a customer token | `403 Forbidden` |
| S5 | No token | `GET /api/bills` without a token | `401 Unauthorized` |
| S6 | Someone else's bill | Pay another customer's bill ID through the API | `404 Bill not found`, bill unchanged |
| S7 | Logged in user on login page | Open `/login` while logged in | Redirected to own dashboard |

### Plans and subscriptions

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| P1 | Guest views plans | Open `/plans` logged out | Active plans sorted by price with "Get started" buttons |
| P2 | Subscribe | Customer with no plan clicks Subscribe and confirms | Success message, card marked "Your plan", PENDING bill created, confirmation email |
| P3 | Upgrade | Choose a more expensive plan | Button says "Upgrade"; old subscription CANCELLED, new one ACTIVE, new bill created, plan change email |
| P4 | Downgrade | Choose a cheaper plan | Button says "Downgrade" and behaves like P3 |
| P5 | Current plan | View plans while subscribed | Current plan button disabled with "Current plan" |
| P6 | Dashboard | Open `/dashboard` | Correct plan, start and renewal dates, days left, history table |
| P7 | Subscribe twice through API | `POST /api/subscriptions` while subscribed | `400` "already have an active subscription" |

### Billing

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| B1 | View bills | Open `/bills` | All bills with status badges and correct amount due |
| B2 | Pay a bill | Click Pay now and confirm | Bill becomes PAID with a payment time; receipt email |
| B3 | Payment history | Open the Payment history tab | Only paid bills, newest first, correct total paid |
| B4 | Pay twice through API | `POST /api/bills/{id}/pay` on a paid bill | `400` "This bill is already paid" |

### Support tickets

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| T1 | Create ticket | Fill the form and submit | Ticket appears as OPEN with priority badge |
| T2 | Missing fields | Submit with an empty subject | Error under the subject field |
| T3 | Admin updates ticket | Admin sets IN_PROGRESS with a remark | Customer sees the new status and remark; update email arrives |
| T4 | Close ticket | Admin sets CLOSED | No more "Update status" button for that ticket |
| T5 | Filters | Use status filters and search on `/admin/tickets` | Lists and counts match |

### Admin

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| D1 | Dashboard numbers | Compare cards with the data | Customers, active subscriptions, open tickets and revenue are correct |
| D2 | Graphs | View `/admin` | Bar graph shows subscribers per plan, line graph shows six months of revenue |
| D3 | Create plan | Add a plan with an empty data limit | Plan created as "Unlimited data" and visible to customers |
| D4 | Plan validation | Save a plan with price 0 | Error under the price field |
| D5 | Edit plan | Change speed and price | Table and public plans show the new values |
| D6 | Deactivate plan | Click Deactivate | Plan shown as INACTIVE and hidden from customers; existing subscriptions unaffected |
| D7 | Subscriptions and bills | Use filters on both pages | Correct rows and totals |

### Profile and general

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| G1 | Update profile | Change name, phone and address | Saved, and the navbar shows the new name |
| G2 | Email field | Try to edit email | Field is read only |
| G3 | Page refresh in production | Refresh on `/bills` on the live site | Page reloads correctly instead of a 404 |
| G4 | Unknown page | Open `/abc` | 404 page with a link home |
| G5 | Mobile layout | Narrow the browser window | Navbar collapses into a menu, tables scroll |
| G6 | Health | Open `/actuator/health` | `{"status":"UP"}` |

---

## 18. Deployment Guide

The order matters, because each part needs the address of the one before it: **Neon first, then Render, then Vercel, then link Render back to Vercel**.

```mermaid
flowchart LR
    G[GitHub repository<br/>branch main] -- "auto deploy" --> R[Render<br/>backend Docker image]
    G -- "auto deploy" --> V[Vercel<br/>frontend build]
    R -- "DB_URL" --> N[(Neon PostgreSQL)]
    V -- "VITE_API_URL" --> R
    R -- "FRONTEND_URL (CORS)" --> V
```

### Step 1: Database on Neon

1. Sign up at neon.tech with GitHub and create a project named `netserve` in a US East region.
2. Click **Connect** and copy the connection string, which looks like
   `postgresql://USER:PASSWORD@HOST/neondb?sslmode=require`.
3. Convert it into three values for the backend:
   * `DB_URL` = `jdbc:postgresql://HOST/neondb?sslmode=require` (add `jdbc:`, use the host without `-pooler`, and drop `channel_binding`)
   * `DB_USERNAME` = the user part
   * `DB_PASSWORD` = the password part

Tables and seed data are created automatically the first time the backend starts.

### Step 2: Backend on Render

The backend is packaged with this `backend/Dockerfile`:

```dockerfile
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY ../../Downloads .
RUN chmod +x mvnw && ./mvnw -q -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

The first stage builds the jar with Maven; the second stage runs it on a smaller Java runtime image.

1. Sign up at render.com with GitHub, click **New**, then **Web Service**, and pick the repository.
2. Settings: name `netserve-api` (or any name), region Ohio, branch `main`, root directory `backend`, language **Docker**, instance type **Free**.
3. Add the environment variables `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `MAIL_USERNAME`, `MAIL_PASSWORD` and `FRONTEND_URL` (use `http://localhost:5173` for now).
4. Optional: under **Settings**, set **Health Check Path** to `/actuator/health`.
5. Click **Deploy Web Service**. The first build takes 5 to 10 minutes. It is ready when the log shows `Started BackendApplication` and the status is **Live**.
6. Check `https://<your-service>.onrender.com/api/plans`.

### Step 3: Frontend on Vercel

1. Sign up at vercel.com with GitHub, click **Add New**, then **Project**, and import the repository.
2. Set **Root Directory** to `frontend`. The framework preset **Vite** is detected automatically.
3. Add one environment variable, type **Config** (not Secret, because Vite variables are public):
   `VITE_API_URL` = `https://<your-service>.onrender.com` with no trailing slash.
4. Click **Deploy**. Use the short production domain from **Settings**, then **Domains** (for this project `https://netserve-frontend.vercel.app`).

`frontend/vercel.json` sends every path to `index.html`, so refreshing on a page such as `/bills` works:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### Step 4: Connect Render to Vercel

On Render, set `FRONTEND_URL` to the Vercel production domain (several origins can be listed with commas, for example the Vercel domain and `http://localhost:5173`). Save and wait for **Live**, then open the Vercel site and run the QA test plan.

### Continuous deployment

Both Render and Vercel redeploy automatically on every push to `main`. A change to `VITE_API_URL` needs a manual **Redeploy** on Vercel, because the value is built into the JavaScript.

---

## 19. Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `password authentication failed` on backend start | Wrong `DB_PASSWORD` | Use the password set when PostgreSQL was installed |
| `database "netserve" does not exist` | Database not created | Create it in pgAdmin or with psql |
| `404 No static resource api/...` | Controller not detected | Make sure every package sits under `com.netserve.backend`, then rebuild |
| `Failed to resolve import "react-router-dom"` | npm packages not installed | Run `npm install` inside `frontend` |
| "Cannot reach the server" in the browser | Backend not running, asleep, wrong `VITE_API_URL`, or CORS | Check the browser console; see the next rows |
| Requests go to `localhost:8080` on the live site | `VITE_API_URL` missing in Vercel | Add it and redeploy |
| Requests go to a `vercel.app` address | `VITE_API_URL` set to the Vercel URL | Set it to the Render URL and redeploy |
| `blocked by CORS policy` | `FRONTEND_URL` does not match the site address | Use the exact origin, with `https` and no trailing slash, then wait for Render to redeploy |
| First request takes about a minute | Render free instance was asleep | Open `/actuator/health` first |
| No emails from the deployed backend | Render's free plan blocks outgoing SMTP ports | Emails work locally; in production use an HTTPS email API such as Brevo |
| No emails locally | Wrong Gmail app password or 2 Step Verification off | Recreate the app password and remove its spaces |
| Swagger request returns 401 | Not authorized | Log in, copy the token, click **Authorize** |
| Dates appear one day early | Time zone conversion of plain dates | Already handled by `formatDate` in `utils/format.js` |

---

## 20. Project Timeline

| Date (2026) | Phase | Work done |
|---|---|---|
| Oct 31 | Planning | Chose the ISP domain, defined 16 functionalities, technologies and deployment targets; simplified the scope to two roles to leave time for deployment; submitted for approval |
| Nov 1 | Environment setup | Installed JDK, Node.js, PostgreSQL, pgAdmin, IntelliJ, Postman; generated the Spring Boot project; created the React app with Vite; created the GitHub repository and README |
| Nov 4 | Data layer | Designed the five entities, enums and relationships; created repositories; Hibernate generated the tables |
| Nov 4 to 9 | Security | JWT service and filter, user details service, security rules, CORS, password hashing, DTOs, global exception handler, register and login, admin seeding |
| Nov 9 | Core features | Plan management, subscriptions and plan changes, automatic billing, payments and history, support tickets, profile updates, admin dashboard queries |
| Nov 9 | Notifications and docs | Asynchronous email service with Gmail SMTP, Swagger with JWT support, secrets moved to environment variables, Postman collection |
| Nov 11 | Frontend | API client and interceptors, auth context, route guards, 14 pages for customers and admins, Chart.js graphs, styling |
| Nov 16 | Deployment | Dockerfile, Neon database, Render backend, Vercel frontend, CORS configuration for multiple origins, investigated the SMTP block on Render |
| Nov 17 | Quality | Unit tests for subscription, billing and ticket rules; Actuator health endpoint; final documentation |
| Nov 18 | Demo | Project demonstration |
| Nov 20 | Final mock | Final mock interview |

---

## 21. Design Decisions

| Decision | Reason |
|---|---|
| Layered architecture (controller, service, repository) | Clear responsibilities, easy to test services in isolation |
| DTOs instead of returning entities | Never exposes password hashes, avoids lazy loading errors and huge nested JSON, keeps the API stable when tables change |
| JWT with stateless sessions | No server side session store; scales easily and fits a separate frontend |
| Role stored in the token and checked by URL rules | Simple, central authorization in `SecurityConfig` |
| Ownership checks return 404, not 403 | Does not reveal that another customer's bill or ticket exists |
| Bills created at subscription time | Simple and predictable billing for the scope; no scheduler needed |
| Plan change cancels and recreates the subscription | Keeps a complete history of every plan a customer had |
| Plans are deactivated, never deleted | Protects foreign keys and historical bills |
| `BigDecimal` and `numeric(10,2)` for money | Avoids floating point rounding errors |
| Enums stored as strings | Readable data that survives enum reordering |
| `@Async` email with plain values | Fast API responses; avoids reading lazy entities on a background thread; email failures are logged and never break the user's action |
| `open-in-view` disabled | All database work happens inside transactional services |
| Environment variables for every secret | Same code runs locally and in production without exposing credentials |
| Global exception handler | Consistent JSON error format for every endpoint |
| Single Axios instance with interceptors | Token handling and session expiry written once for the whole frontend |
| React Context for auth | Login state available everywhere without extra libraries |
| Docker on Render | Render runs Java through Docker; the multi stage build keeps the image small |

---

## 22. Known Limitations and Future Improvements

### Current limitations

* Payments are simulated with a "Pay now" action; no real payment gateway is connected.
* Bills are generated when a customer subscribes or changes plan; there is no automatic monthly renewal yet, and the `EXPIRED` subscription status is reserved for it.
* Emails do not send from the free Render instance because SMTP ports are blocked there.
* The Render free instance sleeps after 15 minutes without traffic.
* There is no password reset or email verification flow.

### Possible improvements

* Scheduled job (`@Scheduled`) to renew subscriptions, issue monthly bills and mark expired ones
* Payment gateway integration such as Stripe
* HTTPS email API (for example Brevo) for production emails, with HTML templates
* Forgot password flow with emailed reset links
* Pagination and sorting for admin tables
* Usage tracking per billing cycle and PDF invoices
* Refresh tokens and token revocation on logout
* Integration tests with Testcontainers and frontend tests with Vitest
* CI pipeline with GitHub Actions running the tests on every push
* Database migrations with Flyway instead of `ddl-auto=update`

---

## 23. Author

**Samir Husen**
Master's student in Computer Science, Wright State University, Fairborn, Ohio
GitHub: https://github.com/samirhusen
