# ✅ Debian base with Node.js + Python + LibreOffice
FROM debian:bullseye-slim

# ✅ Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    build-essential \
    software-properties-common \
    python3 \
    python3-pip \
    python3-venv \
    nodejs \
    npm \
    qpdf \
    libreoffice \
    poppler-utils \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ✅ Set working directory
WORKDIR /app

# ✅ Copy all files
COPY . .

# ✅ Install Node.js backend dependencies
RUN npm install

# ✅ Install Python microservice dependencies
RUN pip3 install --upgrade pip && \
    pip3 install --no-cache-dir -r ./excel-to-pdf-microservice/requirements.txt

# ✅ Expose both ports
EXPOSE 10000 10009

# ✅ Start both: Node.js backend + Python microservice
CMD ["sh", "-c", "node server.js & uvicorn excel-to-pdf-microservice.main:app --host 0.0.0.0 --port 10009"]
