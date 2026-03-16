# Bike Theft Tracker
BikeTheftTracker is a full-stack web application designed to help users report, track, and monitor stolen bicycles. 
It provides an interactive map where users can see reported thefts, add new theft reports, and follow updates related to their bikes.

## Key Features
- **User Authentication:** Users must register and log in to create or modify reports. Authentication is handled securely using JWT tokens stored in HttpOnly cookies.
- **Report Management:** Users can add detailed reports including bike information (e.g. brand, model, serial number), theft details, and optional photos.
- **Profile & Personal Reports:** Users can view, edit, and manage their own reports, including updating the status (e.g. active, recovered, closed).
- **Interactive Map:** All reports are displayed on a map with markers, allowing users to quickly see theft locations and details.

## Technologies Used
- **Frontend:** React, JavaScript, Vite
- **Backend:** Java, Spring Boot, Spring Security, JWT authentication
- **Database:** PostgreSQL with PostGIS extension for geographic queries

### Testing Tools
- **Backend :** JUnit 5, Mockito, H2DB/H2GIS, MockMvc
- **Frontend:** Vitest, React Testing Library

## Getting Started
To get a local copy of this project up and running, follow these steps.

### Prerequisites
**Frontend**
- Node.js
- npm

**Backend**
- JDK 25 or higher
- Maven
- Docker

### Installation
**Clone the repository**
   ```bash
   git clone https://github.com/Roko122/bike-theft-tracker.git
   cd bike-theft-tracker
   ```

**Frontend**
1. Navigate to the `frontend` folder
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
    npm run dev
   ```

4. Open your browser and go to:
   http://localhost:5173

**Backend**
1. Navigate to the `backend` folder
   ```bash
   cd backend
   ```

2. Copy environment variables:
   ```bash
   cp example.env .env
   ```

3. Start the database:
   ```bash
    docker compose up -d
   ```

4. Run the application:
   ```bash
    mvn spring-boot:run
   ```

### API Documentation
The API for this project is documented using **OpenAPI / Swagger UI**. You can view the documentation as follows:

1. Start the backend application.
2. Open your browser and navigate to: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

## License
Distributed under the MIT License. See [License](/LICENSE) for more information.
