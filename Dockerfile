# ✅ Base image with Python first
FROM python:3.11-slim

# ✅ Install Node.js 18 (manually from NodeSource)
RUN apt-get update && \
    apt-get install -y curl gnupg build-essential ca-certificates && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# ✅ Install system deps
RUN apt-get install -y \
    qpdf \
    libreoffice \
    poppler-utils \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ✅ Create app directory
WORKDIR /app

# ✅ Copy all code
COPY . .

# ✅ Install Node dependencies
RUN npm install

# ✅ Install Python dependencies (clean pip install)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r ./excel-to-pdf-microservice/requirements.txt

# ✅ Expose backend + FastAPI ports
EXPOSE 10000 10009

# ✅ Start Node backend + FastAPI Python microservice
CMD ["sh", "-c", "node server.js & uvicorn excel-to-pdf-microservice.main:app --host 0.0.0.0 --port 10009"]
