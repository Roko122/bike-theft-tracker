# Bike Theft Tracker

## Getting Started
To get a local copy of this project up and running, follow these steps.

### Prerequisites
- JDK 25 or higher
- Maven
- Docker

### Installation
**Clone the repository**
   ```bash
   git clone https://github.com/Roko122/bike-theft-tracker.git
   cd bike-theft-tracker
   ```

**Backend**
1. Navigate to `backend` folder
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