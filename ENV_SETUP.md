# 🔐 Environment Variables Setup Guide

Hướng dẫn cấu hình environment variables cho BM Bank System.

## 📋 Overview

Project sử dụng environment variables để quản lý configuration cho:
- **Frontend** (React + Vite): `.env` tại root directory
- **Backend** (Express.js): `.env` tại `server/` directory

## 🚀 Quick Setup

### 1. Frontend Environment

```bash
# Copy example file
cp .env.example .env

# Hoặc tạo file .env mới
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=BM Bank
NODE_ENV=development
EOF
```

**Lưu ý:** Vite chỉ load variables bắt đầu với `VITE_`

### 2. Backend Environment

```bash
# Copy example file
cd server
cp .env.example .env

# Hoặc manual edit
nano .env
```

## 📝 Frontend Variables (.env)

### Cấu hình cơ bản

```env
# API Base URL
VITE_API_URL=http://localhost:5000/api

# Application Settings
VITE_APP_NAME=BM Bank
VITE_APP_VERSION=1.0.0

# Environment
NODE_ENV=development
```

### Environment-specific URLs

#### Development
```env
VITE_API_URL=http://localhost:5000/api
```

#### Staging
```env
VITE_API_URL=https://staging-api.bmbank.com/api
```

#### Production
```env
VITE_API_URL=https://api.bmbank.com/api
```

### Accessing in React

```javascript
// Import và sử dụng
const API_URL = import.meta.env.VITE_API_URL;
const APP_NAME = import.meta.env.VITE_APP_NAME;

console.log('API URL:', API_URL);
```

## 🔧 Backend Variables (server/.env)

### Required Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Oracle Database
ORACLE_USER=system
ORACLE_PASSWORD=Oracle123
ORACLE_CONNECT_STRING=localhost:1521/XE

# Banking Schema
BANKING_ADMIN_USER=admin
BANKING_ADMIN_PASSWORD=123456
BANKING_CONNECT_STRING=localhost:1521/banking

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=http://localhost:5003
```

### Optional Variables

```env
# Logging
LOG_LEVEL=info
LOG_REQUESTS=true

# Security
BCRYPT_ROUNDS=10
PASSWORD_MIN_LENGTH=6

# Database Pool
DB_POOL_MIN=2
DB_POOL_MAX=10

# Feature Flags
ENABLE_AUDIT=true
ENABLE_VPD=true
```

### Accessing in Node.js

```javascript
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

console.log('Server port:', PORT);
```

## 🐳 Docker Environment

### Docker Compose

Environment variables có thể được set trong `docker-compose.yml`:

```yaml
services:
  backend:
    environment:
      - PORT=5000
      - ORACLE_CONNECT_STRING=oracle-db:1521/XE
      - JWT_SECRET=${JWT_SECRET}
    env_file:
      - ./server/.env
```

### Sử dụng .env file với Docker

```bash
# Create .env for Docker
cat > .env << EOF
ORACLE_PWD=Oracle123
JWT_SECRET=my-super-secret-key
BANKING_ADMIN_PASSWORD=admin123
EOF

# Start with env file
docker-compose --env-file .env up -d
```

## 🔒 Security Best Practices

### ⚠️ KHÔNG commit sensitive data

Thêm vào `.gitignore`:

```gitignore
# Environment files
.env
.env.local
.env.*.local
server/.env
server/.env.local

# Keep example files
!.env.example
!server/.env.example
```

### ✅ Generate Strong Secrets

#### JWT Secret
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64

# Output example:
# 8f3d9a7b2c1e4f5a6d8b9c0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
```

#### Oracle Password
```bash
# Generate strong password
openssl rand -base64 32
```

### 🔐 Production Checklist

- [ ] Đổi `JWT_SECRET` thành random string
- [ ] Đổi `ORACLE_PASSWORD` thành strong password
- [ ] Đổi `BANKING_ADMIN_PASSWORD` thành strong password
- [ ] Set `NODE_ENV=production`
- [ ] Update `FRONTEND_URL` thành production domain
- [ ] Enable HTTPS
- [ ] Xóa hoặc comment debug flags
- [ ] Backup .env file securely

## 🌍 Environment-Specific Configs

### Development (.env.development)

```env
VITE_API_URL=http://localhost:5000/api
VITE_ENABLE_DEVTOOLS=true
NODE_ENV=development
```

### Production (.env.production)

```env
VITE_API_URL=https://api.bmbank.com/api
VITE_ENABLE_DEVTOOLS=false
NODE_ENV=production
```

### Vite auto-load

```bash
# Development
npm run dev
# Loads .env.development

# Production
npm run build
# Loads .env.production
```

## 🧪 Testing Environment Variables

### Frontend

```javascript
// vite.config.js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  }
});
```

### Backend

```javascript
// server/config/test.js
import dotenv from 'dotenv';

// Load test environment
dotenv.config({ path: '.env.test' });

console.log('Test DB:', process.env.ORACLE_CONNECT_STRING);
```

## 📊 Variable Priority

Order of precedence (highest to lowest):

1. Shell environment variables
2. `.env.local` (loaded for all environments except test)
3. `.env.development`, `.env.production`, `.env.test`
4. `.env`

Example:
```bash
# .env
VITE_API_URL=http://localhost:5000

# .env.local (overrides .env)
VITE_API_URL=http://localhost:3000

# Command line (overrides all)
VITE_API_URL=http://api.example.com npm run dev
```

## 🔍 Debugging

### Check loaded variables

Frontend (Vite):
```javascript
// src/debug.js
console.log('Environment:', import.meta.env.MODE);
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('All env:', import.meta.env);
```

Backend (Node.js):
```javascript
// server/debug.js
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);
console.log('JWT Secret:', process.env.JWT_SECRET ? '✓ Set' : '✗ Not set');
```

### Common Issues

#### Variable not loaded
```bash
# Make sure file exists
ls -la .env server/.env

# Check file permissions
chmod 644 .env server/.env

# Restart dev server
npm run dev
```

#### Variable undefined in frontend
```bash
# MUST start with VITE_
❌ API_URL=http://localhost:5000
✅ VITE_API_URL=http://localhost:5000

# Restart dev server after changes
```

#### Variable not working in Docker
```bash
# Check if variable is in docker-compose.yml
docker-compose config

# Check inside container
docker exec -it bm-bank-backend env | grep JWT_SECRET
```

## 📚 References

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [dotenv Documentation](https://github.com/motdotla/dotenv)
- [Docker Environment Variables](https://docs.docker.com/compose/environment-variables/)

## 💡 Tips

1. **Never commit .env files** - Use `.env.example` as template
2. **Use different secrets per environment** - Dev ≠ Staging ≠ Production
3. **Rotate secrets regularly** - Especially JWT_SECRET
4. **Keep .env.example updated** - When adding new variables
5. **Document all variables** - In this guide and code comments
6. **Use environment validation** - Check required variables on startup
7. **Backup .env securely** - Use password manager or vault

## ⚙️ Environment Validation

Add to backend startup:

```javascript
// server/config/validate.js
const requiredEnvVars = [
  'PORT',
  'ORACLE_USER',
  'ORACLE_PASSWORD',
  'JWT_SECRET',
  'FRONTEND_URL'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

console.log('✅ All required environment variables are set');
```

---

**Security Reminder:** Never share your `.env` files or commit them to git! 🔒
