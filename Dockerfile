# ================================
# Dockerfile for unified backend
# Runs Node.js + 2 FastAPI microservices
# ================================

FROM python:3.10-slim AS base

# Install Node.js 18 and tools
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

# Install Python deps (each microservice)
RUN pip install --upgrade pip && \
    pip install -r redact-microservice/requirements.txt && \
    pip install -r protect-microservice/requirements.txt && \
    pip install -r unlock-microservice/requirements.txt && \
    pip install -r crop-microservice/requirements.txt

# Install Node.js deps
RUN npm install

# Optional environment flag for Render
ENV RENDER=true

RUN echo '#!/bin/sh' > start.sh && \
    echo 'uvicorn redact-microservice.main:app --host 0.0.0.0 --port 10001 &' >> start.sh && \
    echo 'uvicorn protect-microservice.protect:app --host 0.0.0.0 --port 10002 &' >> start.sh && \
    echo 'uvicorn unlock-microservice.unlock:app --host 0.0.0.0 --port 10003 &' >> start.sh && \
    echo 'uvicorn crop-microservice.crop:app --host 0.0.0.0 --port 10004 &' >> start.sh && \
    echo 'node server.js' >> start.sh && \
    chmod +x start.sh


EXPOSE 10000 10001 10002 10003 10004


CMD ["sh", "./start.sh"]
