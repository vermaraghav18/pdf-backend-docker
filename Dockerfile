# === Base: Node.js with Python + LibreOffice support ===
FROM node:18-slim

# 📦 Install system dependencies (LibreOffice + Python + pip)
RUN apt-get update && \
    apt-get install -y \
    libreoffice \
    python3 \
    python3-pip \
    curl \
    gnupg \
    poppler-utils \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 📁 Create working directory for app
WORKDIR /app

# 📁 Copy full backend-only/ project
COPY . .

# 📦 Install Node.js dependencies
RUN npm install

# 🐍 Install Python dependencies for microservice
RUN pip3 install --no-cache-dir -r ./excel-to-pdf-microservice/requirements.txt

# 🌐 Expose Node backend + microservice port
EXPOSE 10000 10009

# 🚀 Run Node.js and Python servers concurrently
CMD ["sh", "-c", "node server.js & uvicorn excel-to-pdf-microservice.main:app --host 0.0.0.0 --port 10009"]
