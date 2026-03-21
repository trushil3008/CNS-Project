# CNS-Project

MERN authentication project with separate frontend and backend apps.

## Project Structure

```text
CNS-Project/
|-- package.json
|-- README.md
|-- client/
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
|   `-- src/
|       |-- App.jsx
|       |-- index.css
|       |-- main.jsx
|       |-- paypal.svg
|       |-- context/
|       |   `-- AuthContext.jsx
|       `-- pages/
|           |-- Dashboard.jsx
|           |-- Login.jsx
|           `-- Signup.jsx
`-- server/
	|-- .env
	|-- package.json
	|-- server.js
	|-- middleware/
	|   `-- auth.js
	|-- models/
	|   `-- User.js
	`-- routes/
		`-- auth.js
```

## Install Dependencies

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

## Run Project Properly

Open two terminals.

Terminal 1: Start backend server

```bash
cd server
npm run dev
```

Terminal 2: Start frontend app

```bash
cd client
npm run dev
```

Frontend runs on Vite default URL.
Backend runs using the server port configured in server code or environment.

## Build Frontend

```bash
cd client
npm run build
```

## Preview Frontend Build

```bash
cd client
npm run dev
```