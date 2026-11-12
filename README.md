# EventSphere – Full-Stack Event Management Platform

EventSphere is a full-stack event management platform designed to simplify event discovery, organization, and registration. It provides separate experiences for administrators and users, allowing administrators to manage events while users can explore events and discover personalized recommendations.

## 🚀 Features

- **User Authentication:** Secure JWT-based authentication.
- **Role-Based Access Control:** Separate Admin and User privileges.
- **Event Management:** Create, view, update, and delete events.
- **Event Discovery:** Browse events and view detailed event information.
- **Event Registration:** Enable users to register for available events.
- **Personalized Recommendations:** Java-based recommendation logic to suggest relevant events based on user preferences and event information.
- **Responsive UI:** Interactive frontend for a smooth user experience.

## 🛠️ Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Ant Design
- Axios
- React Router

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT Authentication
- RESTful APIs

### Database
- MySQL

### Tools
- Git & GitHub
- Postman
- IntelliJ IDEA
- Visual Studio Code

## 🏗️ Project Architecture

The application follows a client-server architecture:

- **Frontend:** React.js handles the user interface and communicates with the backend through REST APIs.
- **Backend:** Spring Boot manages business logic, authentication, authorization, and event operations.
- **Database:** MySQL stores user accounts, event details, and registration information.

## 📁 Project Structure

```text
EventSphere/
│
├── project/                  # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml
│   └── mvnw
│
└── eventsphere-frontend/     # React Frontend
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.js
    ├── package.json
    └── vite.config.js
```

## ⚙️ Installation and Setup

### Prerequisites

- Java 21 or later
- Node.js and npm
- MySQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/USERNAME/EventSphere.git
cd EventSphere
```

### 2. Configure the Database

Create a MySQL database:

```sql
CREATE DATABASE eventsphere;
```

Configure the database credentials in the backend `application.properties` file:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/eventsphere
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
```

### 3. Run the Backend

Navigate to the backend directory:

```bash
cd project
```

Start the Spring Boot application:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

Backend runs at:

`http://localhost:8080`

### 4. Run the Frontend

Open another terminal:

```bash
cd eventsphere-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:5173`

Configure the frontend API base URL using:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🔐 Security

- JWT-based authentication.
- Role-based authorization for Admin and User accounts.
- Protected administrative operations.
- Secure communication between frontend and backend through REST APIs.

## 🎯 Project Objective

The goal of EventSphere is to provide a centralized platform for event management while improving event discovery through personalized recommendations and simplifying the overall registration experience.

## 👩‍💻 Author

**Prakalya S**



