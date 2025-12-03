# Use Node.js LTS version
FROM node:18-alpine

# Install Oracle Instant Client dependencies
RUN apk add --no-cache libaio libnsl libc6-compat curl wget

# Create app directory
WORKDIR /app

# Download and install Oracle Instant Client
RUN wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip && \
    unzip instantclient-basiclite-linuxx64.zip && \
    rm -f instantclient-basiclite-linuxx64.zip && \
    cd /app/instantclient* && \
    rm -f *jdbc* *occi* *mysql* *README *jar uidrvci genezi adrci && \
    echo /app/instantclient* > /etc/ld.so.conf.d/oracle-instantclient.conf && \
    ldconfig || true

# Set Oracle environment variables
ENV LD_LIBRARY_PATH=/app/instantclient_21_12:$LD_LIBRARY_PATH

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1

# Start the application
CMD ["node", "index.js"]
