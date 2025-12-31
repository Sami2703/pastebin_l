# Pastebin Lite

A simple Pastebin-like application built with Node.js, Express, and MongoDB.

Users can create text pastes, share a unique link, and optionally set
time-based expiration or view-count limits.

## Features
- Create a paste with optional TTL and max views
- Shareable URL for each paste
- View pastes via API or HTML page
- Automatic expiration based on constraints
- Deterministic time support for automated testing

## Tech Stack
- Node.js
- Express
- MongoDB (Mongoose)
- NanoID

## Persistence Layer
MongoDB is used as the persistence layer via Mongoose.
The database is hosted on MongoDB Atlas in production to ensure data
persists across requests in serverless environments.

## Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### Steps
```bash
git clone <your-repo-url>
cd Pastebin
npm install

### Start the server
node src/server.js

# Open in browser
http://localhost:3000

