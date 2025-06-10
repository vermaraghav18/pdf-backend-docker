# ✅ Node.js base + tools only (no Python)
FROM node:18-slim

# ✅ Install PDF tools only
RUN apt-get update && apt-get install -y \
    qpdf \
    curl \
    gnupg \
    poppler-utils \
    unzip \
    ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ✅ Set workdir
WORKDIR /app

# ✅ Copy full backend project
COPY . .

# ✅ Install Node.js dependencies
RUN npm install

# ✅ Expose backend port only
EXPOSE 10000

# ✅ Start Node backend only
CMD ["node", "server.js"]
