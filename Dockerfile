# Stage 1: Build the React application
FROM node:20 as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build:docker

# Stage 2: Serve the React application and the FastAPI backend
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11
WORKDIR /app

# Copy the static React site to the appropriate directory
COPY --from=build /app/dist /app/static

# # Install FastAPI and any other dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI application
# COPY ./backend /app

# Copy the SQLite database
# COPY ./database.db /app/database.db

# Set the API module
# ENV MODULE_NAME=main