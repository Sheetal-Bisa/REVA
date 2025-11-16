# Use Python base image
FROM python:3.10-slim

# Install Node.js
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Verify installations
RUN python --version && node --version && npm --version

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN python -m pip install --upgrade pip && \
    python -m pip install --no-cache-dir -r requirements.txt

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps

# Copy frontend source and build
COPY frontend/ .
RUN npm run build

# Copy backend
WORKDIR /app
COPY backend/ ./backend/

# Copy start script
COPY start.sh .
RUN chmod +x start.sh

# Expose port
EXPOSE 8080

# Start command - use the start script
CMD ["./start.sh"]
