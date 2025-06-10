# ✅ Node.js with Python + LibreOffice
FROM node:18-slim

# ✅ Install system deps
RUN apt-get update && \
    apt-get install -y \
    qpdf \
    libreoffice \
    curl \
    gnupg \
    poppler-utils \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*


# ✅ Create working directory
WORKDIR /app

# ✅ Copy full project
COPY . .

# ✅ Install Node.js deps
RUN npm install

# ✅ Install Python microservice deps
RUN python3 -m pip install --upgrade pip && \
    pip3 install --no-cache-dir -r ./excel-to-pdf-microservice/requirements.txt

# ✅ Expose backend and microservice
EXPOSE 10000 10009

# ✅ Start both services
CMD ["sh", "-c", "node server.js & uvicorn excel-to-pdf-microservice.main:app --host 0.0.0.0 --port 10009"]
