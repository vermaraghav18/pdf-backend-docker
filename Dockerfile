# ================================
# Dockerfile for unified backend
# Runs Node.js + 10 FastAPI microservices + QPDF + LibreOffice
# ================================

FROM python:3.10-slim AS base

# Install Node.js 18, qpdf, libreoffice, and PDF tools
RUN apt-get update && \
    apt-get install -y curl gnupg zip poppler-utils qpdf libreoffice && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy full project
COPY . .

# Install Python dependencies for all microservices
RUN pip install --upgrade pip && \
    pip install -r redact-microservice/requirements.txt && \
    pip install -r protect-microservice/requirements.txt && \
    pip install -r unlock-microservice/requirements.txt && \
    pip install -r crop-microservice/requirements.txt && \
    pip install -r sign-microservice/requirements.txt && \
    pip install -r watermark-microservice/requirements.txt && \
    pip install -r pdf-to-jpg-microservice/requirements.txt && \
    pip install -r jpg-to-pdf-microservice/requirements.txt && \
    pip install -r word-to-pdf-microservice/requirements.txt

# Install Node.js dependencies
RUN npm install

# Optional: Render.com environment variable
ENV RENDER=true

# Create startup script
RUN echo '#!/bin/sh' > start.sh && \
    echo 'uvicorn redact-microservice.main:app --host 0.0.0.0 --port 10001 > redact.log 2>&1 &' >> start.sh && \
    echo 'uvicorn protect-microservice.protect:app --host 0.0.0.0 --port 10002 > protect.log 2>&1 &' >> start.sh && \
    echo 'uvicorn unlock-microservice.unlock:app --host 0.0.0.0 --port 10003 > unlock.log 2>&1 &' >> start.sh && \
    echo 'uvicorn crop-microservice.crop:app --host 0.0.0.0 --port 10004 > crop.log 2>&1 &' >> start.sh && \
    echo 'uvicorn sign-microservice.sign:app --host 0.0.0.0 --port 10005 > sign.log 2>&1 &' >> start.sh && \
    echo 'uvicorn watermark-microservice.watermark:app --host 0.0.0.0 --port 10006 > watermark.log 2>&1 &' >> start.sh && \
    echo 'uvicorn pdf-to-jpg-microservice.pdf_to_jpg:app --host 0.0.0.0 --port 10007 > pdf2jpg.log 2>&1 &' >> start.sh && \
    echo 'uvicorn jpg-to-pdf-microservice.jpg_to_pdf:app --host 0.0.0.0 --port 10008 > jpg2pdf.log 2>&1 &' >> start.sh && \
    echo 'uvicorn word-to-pdf-microservice.main:app --host 0.0.0.0 --port 10010 > word2pdf.log 2>&1 &' >> start.sh && \
    echo 'node server.js' >> start.sh && \
    chmod +x start.sh

# Expose all required ports (Excel2PDF now removed)
EXPOSE 10000 10001 10002 10003 10004 10005 10006 10007 10008 10010

# Start script
CMD ["sh", "./start.sh"]
