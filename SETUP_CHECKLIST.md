# ✅ BM Bank - Setup Checklist

Checklist đầy đủ để setup và deploy BM Bank System.

## 📋 Pre-Setup Checklist

- [ ] Git installed
- [ ] Node.js 18+ installed
- [ ] Docker Desktop installed and running
- [ ] Docker Compose available
- [ ] At least 4GB RAM free (8GB recommended)
- [ ] At least 10GB disk space free

## 🔧 Environment Setup

### Option A: Automated Setup (Recommended)

- [ ] Run setup script:
  ```bash
  # Windows
  setup-env.bat

  # Linux/Mac
  chmod +x setup-env.sh
  ./setup-env.sh
  ```

- [ ] Verify `.env` created at root
- [ ] Verify `server/.env` created
- [ ] Review and customize environment variables if needed

### Option B: Manual Setup

- [ ] Copy frontend env: `cp .env.example .env`
- [ ] Copy backend env: `cp server/.env.example server/.env`
- [ ] Generate JWT secret:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- [ ] Update `JWT_SECRET` in `server/.env`
- [ ] Customize other variables as needed

## 🐳 Docker Deployment

### Quick Start (All Services)

- [ ] Build and start all services:
  ```bash
  docker-compose up -d --build
  ```

- [ ] Wait for Oracle to be healthy (2-3 minutes)
- [ ] Check status:
  ```bash
  docker-compose ps
  ```

- [ ] View logs:
  ```bash
  docker-compose logs -f
  ```

### Database Initialization

- [ ] Run init script:
  ```bash
  # Windows
  init-database.bat

  # Linux/Mac
  chmod +x init-database.sh
  ./init-database.sh
  ```

- [ ] Verify database initialized successfully
- [ ] Test connection:
  ```bash
  docker exec -it bm-bank-oracle-db sqlplus admin/123456@localhost:1521/banking
  ```

### Verify Services

- [ ] Frontend accessible: http://localhost:5003
- [ ] Backend health check: http://localhost:5000/health
- [ ] Oracle EM Express: https://localhost:5500/em
- [ ] All containers running: `docker-compose ps`

## 💻 Development Mode Setup

### Oracle Database Only

- [ ] Start Oracle:
  ```bash
  cd oracle-banking-db
  docker-compose up -d
  ```

- [ ] Wait for Oracle (2-3 minutes)
- [ ] Initialize database (use init-database script)

### Backend Setup

- [ ] Install dependencies:
  ```bash
  cd server
  npm install
  ```

- [ ] Verify `.env` exists
- [ ] Start dev server:
  ```bash
  npm run dev
  ```

- [ ] Verify backend running on port 5000

### Frontend Setup

- [ ] Install dependencies:
  ```bash
  npm install
  ```

- [ ] Verify `.env` exists
- [ ] Start dev server:
  ```bash
  npm run dev
  ```

- [ ] Verify frontend running on port 5003

## 🧪 Testing

### Login Tests

- [ ] Test Customer login: `kh1` / `123456`
- [ ] Test Staff login: `nv1` / `123456`
- [ ] Test Director login: `gd1` / `123456`

### VPD Tests

- [ ] Login as `kh1`
- [ ] Verify only sees own accounts
- [ ] Login as `nv1` (Staff)
- [ ] Verify sees all accounts

### Trigger Tests

- [ ] As Staff, create withdraw transaction exceeding balance
- [ ] Verify error: "Số dư tài khoản không đủ!"
- [ ] Create valid transaction
- [ ] As Director, approve transaction
- [ ] Verify balance updated automatically

### API Tests

- [ ] Health check: `curl http://localhost:5000/health`
- [ ] Login API:
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"kh1","password":"123456"}'
  ```
- [ ] Get accounts with token
- [ ] Verify CORS works from frontend

## 🔒 Security Checklist

### Development

- [ ] `.gitignore` includes `.env` files
- [ ] `.env` files not committed to git
- [ ] Demo passwords acceptable for dev

### Production

- [ ] Change `ORACLE_PASSWORD` from default
- [ ] Change `BANKING_ADMIN_PASSWORD` from default
- [ ] Generate new strong `JWT_SECRET`
- [ ] Change all user passwords from `123456`
- [ ] Set `NODE_ENV=production`
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Setup SSL certificates
- [ ] Enable rate limiting
- [ ] Setup monitoring and logging
- [ ] Configure backup strategy
- [ ] Review security headers (Helmet.js)
- [ ] Enable CORS only for trusted domains
- [ ] Setup database encryption
- [ ] Regular security audits scheduled

## 📊 Database Checklist

- [ ] Schema created (`schema.sql`)
- [ ] VPD policies applied (`vpd-policies.sql`)
- [ ] Audit setup completed (`audit-setup.sql`)
- [ ] Seed data loaded (`seed-data.sql`)
- [ ] Test VPD policies working
- [ ] Test triggers working
- [ ] Test audit trail logging
- [ ] Verify all demo accounts exist
- [ ] Verify account balances correct

## 🎯 Feature Checklist

### Customer Features

- [ ] View accounts list
- [ ] View account details
- [ ] View transaction history
- [ ] Update profile information
- [ ] View only own accounts (VPD)

### Staff Features

- [ ] View all customers
- [ ] Create new customer
- [ ] Create new account
- [ ] Create transaction (deposit/withdraw)
- [ ] View all transactions
- [ ] Search customers

### Director Features

- [ ] View pending approvals
- [ ] Approve transactions
- [ ] Reject transactions
- [ ] View all employees
- [ ] Update employee information
- [ ] Lock/unlock accounts
- [ ] View audit trail
- [ ] View system statistics

## 📝 Documentation Checklist

- [ ] README.md reviewed
- [ ] ENV_SETUP.md available
- [ ] DOCKER_GUIDE.md available
- [ ] DOCKER_QUICKSTART.md available
- [ ] INTEGRATION_GUIDE.md available
- [ ] All demo credentials documented
- [ ] API endpoints documented
- [ ] Database schema documented

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Environment variables configured
- [ ] Database backup strategy in place
- [ ] Monitoring setup
- [ ] Logging configured
- [ ] SSL certificates ready
- [ ] Domain DNS configured

### Deployment

- [ ] Build Docker images
- [ ] Push to registry (if using)
- [ ] Deploy to server
- [ ] Initialize database
- [ ] Verify all services running
- [ ] Test all features
- [ ] Monitor logs for errors

### Post-Deployment

- [ ] Verify HTTPS working
- [ ] Test all user flows
- [ ] Check monitoring dashboards
- [ ] Verify backup jobs running
- [ ] Update documentation
- [ ] Notify team

## 🐛 Troubleshooting Checklist

### Common Issues

- [ ] Port conflicts resolved
- [ ] Docker has enough memory (4GB+)
- [ ] Oracle database fully started
- [ ] All environment variables set correctly
- [ ] CORS configured properly
- [ ] JWT secret properly set
- [ ] Database connection working
- [ ] Logs reviewed for errors

### If Problems Occur

- [ ] Check `docker-compose logs`
- [ ] Verify all ports available
- [ ] Restart Docker Desktop
- [ ] Clear Docker volumes: `docker-compose down -v`
- [ ] Rebuild: `docker-compose up -d --build`
- [ ] Check system resources
- [ ] Review error messages
- [ ] Consult documentation

## ✅ Final Verification

- [ ] All services running
- [ ] All features working
- [ ] All tests passing
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Documentation complete
- [ ] Team trained

---

## 📞 Need Help?

If you encounter issues:

1. Check the relevant documentation:
   - [ENV_SETUP.md](ENV_SETUP.md) for environment issues
   - [DOCKER_GUIDE.md](DOCKER_GUIDE.md) for Docker problems
   - [README.md](README.md) for general setup

2. Review logs:
   ```bash
   docker-compose logs -f
   ```

3. Reset everything:
   ```bash
   docker-compose down -v
   docker-compose up -d --build
   ```

**Good luck! 🎉**
