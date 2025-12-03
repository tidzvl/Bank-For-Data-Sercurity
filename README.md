# 🏦 BM Bank - Banking Management System

Hệ thống quản lý ngân hàng với Oracle Database, bao gồm VPD (Virtual Private Database), Triggers, Audit Trail và JWT Authentication.

## 🌟 Tính năng

### 🔒 Security Features
- **VPD (Virtual Private Database)**: Khách hàng chỉ thấy tài khoản của mình
- **Row-Level Security**: Tự động filter dữ liệu theo user
- **Audit Trail**: Ghi lại toàn bộ hoạt động trên database
- **JWT Authentication**: Bảo mật API với JSON Web Token
- **Role-Based Access Control**: Phân quyền theo vai trò (Customer, Staff, Director)

### 💼 Business Features
- **Customer Portal**:
  - Xem danh sách tài khoản
  - Xem lịch sử giao dịch
  - Quản lý thông tin cá nhân

- **Staff Portal**:
  - Quản lý khách hàng
  - Tạo tài khoản mới
  - Tạo phiếu giao dịch (nạp/rút tiền)

- **Director Portal**:
  - Duyệt/từ chối giao dịch
  - Quản lý nhân viên
  - Xem audit trail
  - Thống kê hệ thống

### 🛡️ Database Features
- **Triggers**:
  - `trg_check_withdraw`: Kiểm tra số dư khi rút tiền
  - `trg_update_balance`: Tự động cập nhật số dư khi duyệt giao dịch

- **VPD Policies**:
  - Customer chỉ xem được tài khoản của mình
  - Staff xem tất cả dữ liệu
  - Director có toàn quyền

## 🏗️ Kiến trúc

```
┌─────────────────┐
│   Frontend      │
│   React + Vite  │──┐
└─────────────────┘  │
                     │ HTTP/REST
┌─────────────────┐  │
│   Backend       │◄─┘
│   Express.js    │
└────────┬────────┘
         │ OracleDB Driver
         │ + JWT Auth
         ▼
┌─────────────────┐
│  Oracle XE      │
│  + VPD          │
│  + Triggers     │
│  + Audit        │
└─────────────────┘
```

## 🚀 Quick Start với Docker

### Yêu cầu
- Docker Desktop 20.10+
- Docker Compose 2.0+
- RAM: 4GB+ (khuyến nghị 8GB)

### 1. Clone Repository
```bash
git clone <repository-url>
cd Bank-For-Data-Sercurity
```

### 2. Start tất cả services
```bash
# Build và start
docker-compose up -d --build

# Xem logs
docker-compose logs -f
```

### 3. Khởi tạo Database
```bash
# Windows
init-database.bat

# Linux/Mac
chmod +x init-database.sh
./init-database.sh
```

### 4. Truy cập ứng dụng
- **Frontend**: http://localhost:5003
- **Backend API**: http://localhost:5000
- **Oracle EM**: https://localhost:5500/em

### 5. Login
- **Customer**: `kh1` / `123456` hoặc `kh2` / `123456`
- **Staff**: `nv1` / `123456`
- **Director**: `gd1` / `123456`

## 🛠️ Development Mode

### Prerequisites
- Node.js 18+
- Oracle Instant Client
- Docker (chỉ cho Oracle DB)

### 1. Setup Environment Variables

```bash
# Auto setup (recommended)
# Windows:
setup-env.bat

# Linux/Mac:
chmod +x setup-env.sh
./setup-env.sh

# Manual setup:
cp .env.example .env
cp server/.env.example server/.env
# Edit files to customize
```

See [ENV_SETUP.md](ENV_SETUP.md) for detailed configuration.

### 2. Start Oracle Database
```bash
cd oracle-banking-db
docker-compose up -d
```

### 3. Setup Backend
```bash
cd server
npm install
npm run dev
```

### 4. Setup Frontend
```bash
npm install
npm run dev
```

## 📁 Cấu trúc Project

```
Bank-For-Data-Sercurity/
├── src/                        # Frontend source
│   ├── components/            # React components
│   ├── context/              # React context (Auth)
│   ├── pages/                # Page components
│   │   ├── customer/        # Customer portal
│   │   ├── staff/           # Staff portal
│   │   └── director/        # Director portal
│   └── services/            # API services
│       └── api.js           # API client
│
├── server/                    # Backend source
│   ├── routes/              # API routes
│   │   ├── auth.js         # Authentication
│   │   ├── customer.js     # Customer APIs
│   │   ├── staff.js        # Staff APIs
│   │   └── director.js     # Director APIs
│   ├── middleware/          # Express middleware
│   ├── db/                  # Database connection
│   ├── index.js            # Entry point
│   └── Dockerfile          # Backend Docker image
│
├── oracle-banking-db/         # Database setup
│   ├── sql/
│   │   ├── schema.sql      # Database schema
│   │   ├── vpd-policies.sql # VPD setup
│   │   ├── audit-setup.sql  # Audit configuration
│   │   └── seed-data.sql    # Sample data
│   └── docker-compose.yml   # Oracle DB only
│
├── docker-compose.yml         # Full stack orchestration
├── Dockerfile                # Frontend Docker image
├── init-database.sh          # Database init script (Linux/Mac)
├── init-database.bat         # Database init script (Windows)
└── DOCKER_GUIDE.md           # Docker deployment guide
```

## 📚 Documentation

- [**Environment Setup Guide**](ENV_SETUP.md) - Hướng dẫn cấu hình environment variables
- [**Docker Deployment Guide**](DOCKER_GUIDE.md) - Hướng dẫn deploy với Docker
- [**Docker Quick Start**](DOCKER_QUICKSTART.md) - Quick start với Docker trong 5 phút
- [**Integration Guide**](INTEGRATION_GUIDE.md) - Hướng dẫn tích hợp Frontend-Backend
- [**Quick Start**](QUICK_START.md) - Hướng dẫn nhanh
- [**Server Setup**](SERVER_SETUP_COMPLETE.md) - Hướng dẫn setup server

## 🧪 Testing

### Test VPD
```sql
-- Login as kh1
SELECT * FROM admin.account_balance;
-- Chỉ thấy accounts của kh1

-- Login as nv1 (Staff)
SELECT * FROM admin.account_balance;
-- Thấy tất cả accounts
```

### Test Triggers
```sql
-- Test rút tiền quá số dư
INSERT INTO admin.transaction_log (customer_username, account_id, type, amount)
VALUES ('kh1', 1, 'WITHDRAW', 999999);
-- Lỗi: ORA-20001: Số dư tài khoản không đủ!

-- Test cập nhật số dư tự động
UPDATE admin.transaction_log
SET status = 'accepted'
WHERE id = 1;
-- Trigger tự động cập nhật account_balance
```

### Test API
```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"kh1","password":"123456"}'

# Get accounts (với token)
curl http://localhost:5000/api/customer/accounts \
  -H "Authorization: Bearer <token>"
```

## 🔐 Security Notes

⚠️ **QUAN TRỌNG cho Production:**

1. **Đổi passwords**:
   - Oracle: `ORACLE_PWD`
   - Admin: `BANKING_ADMIN_PASSWORD`
   - JWT: `JWT_SECRET`

2. **Enable HTTPS**:
   - Sử dụng SSL certificates
   - Configure reverse proxy (nginx)

3. **Environment Variables**:
   - Không commit `.env` files
   - Sử dụng secrets management

4. **Database**:
   - Backup thường xuyên
   - Enable encryption
   - Restrict network access

## 🐛 Troubleshooting

### Oracle không start
```bash
# Kiểm tra logs
docker-compose logs oracle-db

# Tăng memory
# Edit docker-compose.yml: shm_size: 2g

# Reset database
docker-compose down -v
docker-compose up -d oracle-db
```

### Backend không kết nối DB
```bash
# Kiểm tra Oracle đã sẵn sàng
docker exec -it bm-bank-oracle-db sqlplus system/Oracle123@XE

# Kiểm tra connection string
echo $ORACLE_CONNECT_STRING
```

### CORS errors
```bash
# Kiểm tra FRONTEND_URL trong .env
# Đảm bảo = http://localhost:5003

# Restart backend
docker-compose restart backend
```

## 📊 Database Schema

### Core Tables
- `admin.users` - User accounts (khách hàng + nhân viên)
- `admin.account_balance` - Tài khoản ngân hàng
- `admin.transaction_log` - Lịch sử giao dịch

### VPD Context
- `USERENV('CLIENT_IDENTIFIER')` - Lưu username hiện tại
- Policy function filter theo username

### Audit Tables
- `admin.audit_trail` - Ghi lại tất cả operations

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Express.js + OracleDB
- **Database**: Oracle XE 21c

## 📞 Support

Nếu gặp vấn đề:
1. Xem [DOCKER_GUIDE.md](DOCKER_GUIDE.md)
2. Check logs: `docker-compose logs`
3. Reset: `docker-compose down -v && docker-compose up -d --build`

---

**Made with ❤️ for Data Security Course**
