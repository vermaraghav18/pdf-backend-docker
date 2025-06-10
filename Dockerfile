# ✅ Start with Python base (more compatible for pip builds)
FROM python:3.10-slim

# ✅ Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    qpdf \
    libreoffice \
    poppler-utils \
    build-essential \
    ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ✅ Install Node.js (LTS version) manually
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm

# ✅ Create app directory
WORKDIR /app

# ✅ Copy entire backend
COPY . .

# ✅ Install Node.js dependencies
RUN npm install

# ✅ Install Python dependencies for microservice
RUN pip install --no-cache-dir -r ./excel-to-pdf-microservice/requirements.txt

# ✅ Expose ports
EXPOSE 10000 10009

# ✅ Start both servers
CMD ["sh", "-c", "node server.js & uvicorn excel-to-pdf-microservice.main:app --host 0.0.0.0 --port 10009"]
