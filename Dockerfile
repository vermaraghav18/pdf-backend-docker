# ================================
# Dockerfile for PDF Tools (Node.js only)
# Supports QPDF + LibreOffice + PDF tools
# ================================

FROM node:18-slim

# Install PDF tool dependencies
RUN apt-get update && \
    apt-get install -y qpdf libreoffice curl gnupg poppler-utils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy full project
COPY . .

# Install Node.js dependencies
RUN npm install

# Optional: environment variable for Render
ENV RENDER=true

# Expose backend port
EXPOSE 10000

# Start the backend server
CMD ["node", "server.js"]
