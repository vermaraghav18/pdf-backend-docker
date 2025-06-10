# ✅ Use official Node.js 18 base with Debian compatibility
FROM node:18-slim

# ✅ Install Python + LibreOffice + other tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    qpdf \
    libreoffice \
    poppler-utils \
    curl \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ✅ Set working directory
WORKDIR /app

# ✅ Copy project files
COPY . .

# ✅ Install Node dependencies
RUN npm install

# ✅ Install Python dependencies for microservice
RUN pip3 install --upgrade pip && \
    pip3 install --no-cache-dir -r ./excel-to-pdf-microservice/requirements.txt

# ✅ Expose backend + microservice ports
EXPOSE 10000 10009

# ✅ Start both backend and FastAPI
CMD ["sh", "-c", "node server.js & uvicorn excel-to-pdf-microservice.main:app --host 0.0.0.0 --port 10009"]
