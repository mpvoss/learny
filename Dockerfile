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

RUN apt-get update && apt-get install -y nginx

# Copy the static React site to the appropriate directory
COPY --from=build /app/dist /var/www/html

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/sites-available/default

# # Install FastAPI and any other dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI application
COPY ./backend /app


# run docker_entrypoint.sh
COPY ./docker_entrypoint.sh /app/docker_entrypoint.sh
RUN chmod +x /app/docker_entrypoint.sh

# Expose the port that the FastAPI application will run on
EXPOSE 8005

CMD service nginx start && /app/docker_entrypoint.sh