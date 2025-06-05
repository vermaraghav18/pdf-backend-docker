# ================================
# Dockerfile for unified backend
# Runs both Node.js (server.js) and FastAPI (redact-microservice/main.py)
# ================================

# Base image with Python and Node.js support
FROM python:3.10-slim AS base

# Install Node.js & other required tools
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# =============================
# Install Python dependencies
# =============================
RUN pip install --upgrade pip && \
    pip install -r redact-microservice/requirements.txt

# =============================
# Install Node dependencies
# =============================
RUN cd /app && npm install

# =============================
# Create a startup script
# =============================
RUN echo '#!/bin/sh' > start.sh && \
    echo 'uvicorn redact-microservice.main:app --host 0.0.0.0 --port 10001 &' >> start.sh && \
    echo 'node server.js' >> start.sh && \
    chmod +x start.sh

# Expose ports for both services
EXPOSE 10000 10001

# Start both services
CMD ["sh", "./start.sh"]
