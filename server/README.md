# Banking API Server

Express.js API server kết nối với Oracle Database cho hệ thống Banking.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` và cập nhật thông tin:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
ORACLE_CONNECT_STRING=localhost:1521/XE
BANKING_CONNECT_STRING=localhost:1521/banking
BANKING_ADMIN_USER=admin
BANKING_ADMIN_PASSWORD=123456
JWT_SECRET=your-secret-key
```

### 3. Setup Oracle Database

Đảm bảo Oracle Database đã chạy:

```bash
# Từ thư mục oracle-banking-db
docker-compose up -d

# Chờ database khởi động
docker logs -f oracle-banking-db

# Chạy init scripts
docker exec -it oracle-banking-db bash
sqlplus admin/123456@localhost:1521/banking @/opt/oracle/sql/schema.sql
```

### 4. Start Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: **http://localhost:5000**

## 📡 API Endpoints

### Authentication

#### POST `/api/auth/login`
Login và nhận JWT token.

**Request:**
```json
{
  "username": "kh1",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "kh1",
    "fullname": "Nguyen Van A",
    "role": "CUSTOMER",
    "accounts": [
      { "id": 1, "balance": 0, "status": "active" },
      { "id": 2, "balance": 500000, "status": "active" }
    ]
  }
}
```

**Errors:**
- `401`: Invalid credentials
- `403`: Account locked
- `503`: Database connection error

---

### Customer Endpoints

Tất cả endpoints yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

#### GET `/api/customer/accounts`
Lấy danh sách tài khoản của khách hàng (VPD filtering).

**Response:**
```json
{
  "success": true,
  "accounts": [
    {
      "id": 1,
      "username": "kh1",
      "balance": 0,
      "status": "active"
    },
    {
      "id": 2,
      "username": "kh1",
      "balance": 500000,
      "status": "active"
    }
  ]
}
```

#### GET `/api/customer/accounts/:id`
Lấy thông tin chi tiết 1 tài khoản.

#### GET `/api/customer/transactions`
Lấy lịch sử giao dịch (VPD filtering).

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": 1,
      "account_id": 2,
      "username": "kh1",
      "amount": 100000,
      "type": "DEPOSIT",
      "req_date": "2025-01-15T10:30:00.000Z",
      "status": "accepted"
    }
  ]
}
```

#### GET `/api/customer/profile`
Lấy thông tin hồ sơ khách hàng.

#### PUT `/api/customer/profile`
Cập nhật thông tin hồ sơ.

**Request:**
```json
{
  "fullname": "Nguyen Van A",
  "phone": "0901234567"
}
```

---

### Staff Endpoints

Yêu cầu role: `STAFF`

#### GET `/api/staff/customers`
Lấy danh sách tất cả khách hàng.

#### POST `/api/staff/customers`
Tạo khách hàng mới.

**Request:**
```json
{
  "username": "kh3",
  "fullname": "Le Van C",
  "cccd": "012345678910",
  "phone": "0923456789",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo khách hàng thành công",
  "customer": {
    "username": "kh3",
    "fullname": "Le Van C",
    "cccd": "012345678910",
    "phone": "0923456789"
  }
}
```

#### GET `/api/staff/accounts`
Lấy danh sách tất cả tài khoản.

#### POST `/api/staff/accounts`
Tạo tài khoản mới cho khách hàng.

**Request:**
```json
{
  "username": "kh1",
  "initial_balance": 0
}
```

#### GET `/api/staff/transactions`
Lấy danh sách tất cả giao dịch.

#### POST `/api/staff/transactions`
Tạo phiếu giao dịch mới.

**Request:**
```json
{
  "account_id": 2,
  "username": "kh1",
  "amount": 100000,
  "type": "WITHDRAW"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo phiếu giao dịch thành công",
  "transaction": {
    "id": 15,
    "account_id": 2,
    "username": "kh1",
    "amount": 100000,
    "type": "WITHDRAW",
    "status": "pending"
  }
}
```

**Errors:**
- `400`: "Số dư tài khoản không đủ!" (Trigger validation)

---

### Director Endpoints

Yêu cầu role: `DIRECTOR`

#### GET `/api/director/pending-approvals`
Lấy danh sách phiếu chờ duyệt.

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": 15,
      "account_id": 2,
      "username": "kh1",
      "fullname": "Nguyen Van A",
      "amount": 100000,
      "type": "WITHDRAW",
      "req_date": "2025-01-15T10:30:00.000Z",
      "status": "pending",
      "current_balance": 500000
    }
  ]
}
```

#### PUT `/api/director/approve/:id`
Duyệt phiếu giao dịch.

**Response:**
```json
{
  "success": true,
  "message": "Duyệt giao dịch thành công. Số dư đã được cập nhật tự động."
}
```

**Note:** Trigger `trg_update_balance` sẽ tự động cập nhật số dư!

#### PUT `/api/director/reject/:id`
Từ chối phiếu giao dịch.

#### GET `/api/director/employees`
Lấy danh sách nhân viên (xem tất cả lương).

**Response:**
```json
{
  "success": true,
  "employees": [
    {
      "username": "gd1",
      "salary": 5000,
      "position": "DIRECTOR"
    },
    {
      "username": "nv1",
      "salary": 1000,
      "position": "STAFF"
    }
  ]
}
```

#### PUT `/api/director/employees/:username`
Cập nhật thông tin nhân viên.

**Request:**
```json
{
  "salary": 1500,
  "position": "STAFF"
}
```

#### PUT `/api/director/accounts/:id/lock`
Khóa tài khoản.

#### PUT `/api/director/accounts/:id/unlock`
Mở khóa tài khoản.

#### GET `/api/director/audit-trail`
Lấy audit trail.

**Query params:**
- `limit`: Số lượng records (default: 100)
- `object_name`: Filter theo table (CUSTOMER_INFO, TRANSACTION_LOG, etc.)

**Response:**
```json
{
  "success": true,
  "audit_log": [
    {
      "timestamp": "2025-01-15T10:30:00.000Z",
      "user": "KH1",
      "action": "SELECT",
      "object": "ACCOUNT_BALANCE",
      "sql": "SELECT * FROM admin.account_balance"
    }
  ]
}
```

#### GET `/api/director/stats`
Lấy thống kê tổng quan.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalCustomers": 2,
    "totalAccounts": 3,
    "pendingTransactions": 3,
    "totalEmployees": 2,
    "totalBalance": 700000,
    "todayTransactions": 5
  }
}
```

---

## 🔐 Security Features

### 1. JWT Authentication
- Token expires trong 24h (configurable)
- Token chứa: username, role, fullname
- Middleware `authenticateToken` validate token

### 2. Role-Based Access Control (RBAC)
```javascript
// Example: Only DIRECTOR can access
router.use(requireRole('DIRECTOR'));
```

### 3. Oracle Authentication
- Connect trực tiếp với Oracle user credentials
- Oracle validate password và profile
- Password security profile tự động apply

### 4. VPD (Virtual Private Database)
- Oracle VPD policies tự động filter data
- Customer chỉ thấy dữ liệu của mình
- Staff chỉ thấy lương của mình

### 5. Triggers
- `trg_check_withdraw`: Validate số dư trước khi rút
- `trg_update_balance`: Auto update balance khi duyệt

## 🧪 Testing API

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"kh1","password":"123456"}'
```

**Get Accounts (with token):**
```bash
curl -X GET http://localhost:5000/api/customer/accounts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Create Transaction (Staff):**
```bash
curl -X POST http://localhost:5000/api/staff/transactions \
  -H "Authorization: Bearer STAFF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": 2,
    "username": "kh1",
    "amount": 100000,
    "type": "WITHDRAW"
  }'
```

**Approve Transaction (Director):**
```bash
curl -X PUT http://localhost:5000/api/director/approve/15 \
  -H "Authorization: Bearer DIRECTOR_TOKEN"
```

### Using Postman

1. Import collection từ `postman_collection.json`
2. Set environment variables:
   - `base_url`: http://localhost:5000
   - `token`: (auto-set after login)
3. Run tests

## 📂 Project Structure

```
server/
├── config/
│   └── database.js          # Oracle connection config
├── middleware/
│   └── auth.js              # JWT middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── customer.js          # Customer endpoints
│   ├── staff.js             # Staff endpoints
│   └── director.js          # Director endpoints
├── .env                     # Environment config
├── .env.example             # Example config
├── index.js                 # Main server file
├── package.json
└── README.md
```

## 🐛 Troubleshooting

### Oracle Client Error
```
Error: DPI-1047: Cannot locate a 64-bit Oracle Client library
```

**Solution:**
1. Download Oracle Instant Client: https://www.oracle.com/database/technologies/instant-client/downloads.html
2. Extract to `C:\oracle\instantclient_19_8`
3. Uncomment trong `database.js`:
```javascript
oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_19_8' });
```

### Connection Refused
```
Error: ORA-12154: TNS:could not resolve the connect identifier
```

**Solution:**
- Check Oracle Database đã chạy: `docker ps`
- Verify connect string trong `.env`
- Test connection: `sqlplus admin/123456@localhost:1521/banking`

### Trigger Error
```
ORA-20001: Số dư tài khoản này không đủ!
```

**This is expected!** Trigger `trg_check_withdraw` đang hoạt động đúng.

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| ORACLE_USER | System user | system |
| ORACLE_PASSWORD | System password | Oracle123 |
| BANKING_ADMIN_USER | Banking admin | admin |
| BANKING_ADMIN_PASSWORD | Admin password | 123456 |
| BANKING_CONNECT_STRING | Connection string | localhost:1521/banking |
| JWT_SECRET | JWT secret key | (required) |
| JWT_EXPIRES_IN | Token expiry | 24h |
| FRONTEND_URL | CORS origin | http://localhost:5003 |

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

**Ready to use! 🎉**

Start server: `npm run dev`
API: http://localhost:5000
