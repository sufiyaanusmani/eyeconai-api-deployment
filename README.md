## Prerequisites

- **Node.js** (v14 or higher) - v20 recommended
- **npm** (comes with Node.js)

If you want to use Docker, you will also need:
- **Docker**
- **Docker Compose**

## Getting Started

1. **Clone the repository**:
    ```bash
    git clone https://github.com/c137519edbb3/Backend
    cd <repository_folder>
    ```

3. **Environment Variables**:
   Create a `.env` file in the root of your project and add the necessary environment variables using `.env.template`

## Running the App

### Without Docker

1. **Install dependencies**:
    ```bash
    npm install
    ```

2. **Start the server**:
    ```bash
    npm run dev
    ```

3. **Access the app**:
   The server will start at `http://localhost:3000` (or the port specified in `.env`).

### With Docker

1. **Run Docker Compose**:
   In the project root directory, run the following command to build and start the app in Docker containers:

    ```bash
    docker compose up --build
    ```

2. **Access the app**:
   Once the containers are up and running, the app should be available at `http://localhost:3000` (or the port specified in `.env`).
