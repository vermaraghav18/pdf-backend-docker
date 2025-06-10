# ✅ Debian base to support full build tools + node + python
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
    qpdf \
    libreoffice \
    poppler-utils \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ✅ Install Node.js 18.x manually
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# ✅ Set workdir
WORKDIR /app

# ✅ Copy full backend project
COPY . .

# ✅ Install Node dependencies
RUN npm install

# ✅ Install Python microservice dependencies
RUN pip3 install --upgrade pip && \
    pip3 install --no-cache-dir -r ./excel-to-pdf-microservice/requirements.txt

# ✅ Expose ports
EXPOSE 10000 10009

# ✅ Start both Node and FastAPI servers
CMD ["sh", "-c", "node server.js & uvicorn excel-to-pdf-microservice.main:app --host 0.0.0.0 --port 10009"]
