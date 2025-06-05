# ================================
# Dockerfile for unified backend
# Runs Node.js + 8 FastAPI microservices
# ================================

FROM python:3.10-slim AS base

# Install Node.js 18 and tools
RUN apt-get update && \
    apt-get install -y curl gnupg zip && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

# Install Python dependencies (all microservices)
RUN pip install --upgrade pip && \
    pip install -r redact-microservice/requirements.txt && \
    pip install -r protect-microservice/requirements.txt && \
    pip install -r unlock-microservice/requirements.txt && \
    pip install -r crop-microservice/requirements.txt && \
    pip install -r sign-microservice/requirements.txt && \
    pip install -r watermark-microservice/requirements.txt && \
    pip install -r pdf-to-jpg-microservice/requirements.txt && \
    pip install -r jpg-to-pdf-microservice/requirements.txt

# Install Node.js dependencies
RUN npm install

# Optional: environment variable for Render
ENV RENDER=true

# Startup script for all services
RUN echo '#!/bin/sh' > start.sh && \
    echo 'uvicorn redact-microservice.main:app --host 0.0.0.0 --port 10001 &' >> start.sh && \
    echo 'uvicorn protect-microservice.protect:app --host 0.0.0.0 --port 10002 &' >> start.sh && \
    echo 'uvicorn unlock-microservice.unlock:app --host 0.0.0.0 --port 10003 &' >> start.sh && \
    echo 'uvicorn crop-microservice.crop:app --host 0.0.0.0 --port 10004 &' >> start.sh && \
    echo 'uvicorn sign-microservice.sign:app --host 0.0.0.0 --port 10005 &' >> start.sh && \
    echo 'uvicorn watermark-microservice.watermark:app --host 0.0.0.0 --port 10006 &' >> start.sh && \
    echo 'uvicorn pdf-to-jpg-microservice.pdf_to_jpg:app --host 0.0.0.0 --port 10007 &' >> start.sh && \
    echo 'uvicorn jpg-to-pdf-microservice.jpg_to_pdf:app --host 0.0.0.0 --port 10008 &' >> start.sh && \
    echo 'node server.js' >> start.sh && \
    chmod +x start.sh

# Expose all service ports
EXPOSE 10000 10001 10002 10003 10004 10005 10006 10007 10008

CMD ["sh", "./start.sh"]
