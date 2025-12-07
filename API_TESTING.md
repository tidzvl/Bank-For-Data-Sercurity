# API Testing Guide - BM Bank Backend

Base URL: `http://localhost:5000/api`

---

## 1. Authentication APIs

### 1.1. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "kh1",
    "password": "123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "kh1",
    "fullname": "Nguyen Van A",
    "cccd": "012345678901",
    "phone": "0901234567",
    "role": "CUSTOMER",
    "accounts": [...]
  }
}
```

**Available Users:**
- `kh1` / `123456` - Customer
- `kh2` / `123456` - Customer
- `nv1` / `123456` - Staff
- `gd1` / `123456` - Director

### 1.2. Verify Token
```bash
curl -X POST http://localhost:5000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_JWT_TOKEN_HERE"
  }'
```

---

## 2. Customer APIs (Role: CUSTOMER)

**Note:** Replace `YOUR_TOKEN` with the token from login response.

### 2.1. Get All Accounts
```bash
curl -X GET http://localhost:5000/api/customer/accounts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2.2. Get Specific Account
```bash
curl -X GET http://localhost:5000/api/customer/accounts/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2.3. Get Transaction History
```bash
curl -X GET http://localhost:5000/api/customer/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2.4. Get Profile
```bash
curl -X GET http://localhost:5000/api/customer/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2.5. Update Profile
```bash
curl -X PUT http://localhost:5000/api/customer/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Nguyen Van A Updated",
    "phone": "0901234567"
  }'
```

---

## 3. Staff APIs (Role: STAFF)

**Login as Staff first:** `nv1` / `123456`

### 3.1. Get All Customers
```bash
curl -X GET http://localhost:5000/api/staff/customers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3.2. Create New Customer
```bash
curl -X POST http://localhost:5000/api/staff/customers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testkh",
    "fullname": "Test Customer",
    "cccd": "001234567890",
    "phone": "0987654321",
    "password": "123456"
  }'
```

### 3.3. Get All Accounts
```bash
curl -X GET http://localhost:5000/api/staff/accounts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3.3.1. Get Customer's Accounts
```bash
# Get all accounts of a specific customer by username
curl -X GET http://localhost:5000/api/staff/customers/kh1/accounts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "accounts": [
    {
      "id": 1,
      "account_number": "ACC001234567890",
      "username": "kh1",
      "fullname": "Nguyen Van A",
      "balance": 500000,
      "account_type": "CHECKING",
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "account_number": "ACC001234567891",
      "username": "kh1",
      "fullname": "Nguyen Van A",
      "balance": 1000000,
      "account_type": "SAVINGS",
      "status": "active",
      "created_at": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

**Use Case:**
- Used in Staff Transaction page to load customer's accounts after selecting customer
- Flow: Select Customer → Load Customer's Accounts → Select Account → Create Transaction

### 3.4. Create New Account
```bash
curl -X POST http://localhost:5000/api/staff/accounts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "kh1",
    "initial_balance": 1000000
  }'
```

### 3.5. Get All Transactions
```bash
curl -X GET http://localhost:5000/api/staff/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3.6. 🔥 Create Transaction (TRIGGER DEMO)

**Test Case 1: Deposit - Should SUCCESS**
```bash
curl -X POST http://localhost:5000/api/staff/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": 2,
    "username": "kh1",
    "amount": 100000,
    "type": "DEPOSIT"
  }'
```

**Test Case 2: Withdraw with INSUFFICIENT BALANCE - Trigger will BLOCK**
```bash
# Assume account #2 has 500,000 VND balance
curl -X POST http://localhost:5000/api/staff/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": 2,
    "username": "kh1",
    "amount": 1000000,
    "type": "WITHDRAW"
  }'
```

**Expected Error Response (Trigger Blocked):**
```json
{
  "error": "🚫 TRIGGER CHẶN: Số dư tài khoản không đủ!",
  "trigger_info": {
    "name": "trg_check_withdraw",
    "type": "BEFORE INSERT",
    "description": "Trigger kiểm tra số dư trước khi tạo giao dịch rút tiền",
    "error_code": "ORA-20001",
    "message": "Trigger đã chặn giao dịch vì số dư không đủ để rút"
  },
  "suggestion": "Vui lòng kiểm tra lại số dư tài khoản và thử lại với số tiền nhỏ hơn."
}
```

**Test Case 3: Withdraw with SUFFICIENT BALANCE - Should SUCCESS**
```bash
curl -X POST http://localhost:5000/api/staff/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": 2,
    "username": "kh1",
    "amount": 100000,
    "type": "WITHDRAW"
  }'
```

---

## 4. Director APIs (Role: DIRECTOR)

**Login as Director first:** `gd1` / `123456`

### 4.1. Get Pending Approvals
```bash
curl -X GET http://localhost:5000/api/director/pending-approvals \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4.2. 🔥 Approve Transaction (TRIGGER AUTO UPDATE)
```bash
# Get transaction ID from pending-approvals
curl -X PUT http://localhost:5000/api/director/approve/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Success Response (Trigger Auto Update):**
```json
{
  "success": true,
  "message": "✅ TRIGGER TỰ ĐỘNG: Duyệt giao dịch thành công. Số dư đã được cập nhật tự động!",
  "trigger_info": {
    "name": "trg_update_balance",
    "type": "AFTER UPDATE",
    "description": "Trigger tự động cập nhật số dư tài khoản khi duyệt giao dịch",
    "action_performed": "Tự động cập nhật số dư",
    "transaction_type": "DEPOSIT",
    "amount": 100000,
    "old_balance": 500000,
    "new_balance": 600000,
    "balance_change": 100000
  }
}
```

### 4.3. Reject Transaction
```bash
curl -X PUT http://localhost:5000/api/director/reject/2 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4.4. Get All Employees
```bash
curl -X GET http://localhost:5000/api/director/employees \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4.5. Update Employee
```bash
curl -X PUT http://localhost:5000/api/director/employees/nv1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "salary": 20000000,
    "position": "STAFF"
  }'
```

### 4.6. Lock Account
```bash
curl -X PUT http://localhost:5000/api/director/accounts/1/lock \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4.7. Unlock Account
```bash
curl -X PUT http://localhost:5000/api/director/accounts/1/unlock \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4.8. Get Audit Trail
```bash
curl -X GET "http://localhost:5000/api/director/audit-trail?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4.9. Get Dashboard Statistics
```bash
curl -X GET http://localhost:5000/api/director/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 5. Demo APIs (VPD & Trigger Testing)

### 5.1. Test VPD - Customer Data Access
```bash
# Login as different users to see VPD in action
# Customer kh1 will only see their own data
curl -X GET http://localhost:5000/api/demo/vpd/customer-data \
  -H "Authorization: Bearer KH1_TOKEN"

# Staff nv1 will see all customer data
curl -X GET http://localhost:5000/api/demo/vpd/customer-data \
  -H "Authorization: Bearer NV1_TOKEN"

# Director gd1 will see all data
curl -X GET http://localhost:5000/api/demo/vpd/customer-data \
  -H "Authorization: Bearer GD1_TOKEN"
```

### 5.2. Test VPD - Employee Salary Access
```bash
# Staff nv1 will only see their own salary
curl -X GET http://localhost:5000/api/demo/vpd/employee-salary \
  -H "Authorization: Bearer NV1_TOKEN"

# Director gd1 will see all salaries
curl -X GET http://localhost:5000/api/demo/vpd/employee-salary \
  -H "Authorization: Bearer GD1_TOKEN"

# Customer kh1 will get ACCESS DENIED
curl -X GET http://localhost:5000/api/demo/vpd/employee-salary \
  -H "Authorization: Bearer KH1_TOKEN"
```

### 5.3. Test All VPD Policies
```bash
curl -X GET http://localhost:5000/api/demo/vpd/test-all \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5.4. Test Trigger - Withdraw with Insufficient Balance
```bash
curl -X POST http://localhost:5000/api/demo/trigger/withdraw \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": 2,
    "amount": 999999999
  }'
```

### 5.5. Test Trigger - Approve and Auto Update Balance
```bash
# First create a transaction, then approve it
curl -X POST http://localhost:5000/api/demo/trigger/approve/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 6. Health Check

```bash
curl -X GET http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-12-04T10:00:00.000Z",
  "service": "Banking API Server"
}
```

---

## 🔥 TRIGGER DEMO FLOW

### Complete Flow to Test Both Triggers:

1. **Login as Staff (nv1)**
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"nv1","password":"123456"}' \
  | jq -r '.token')
```

2. **Try to withdraw MORE than balance (Trigger blocks)**
```bash
curl -X POST http://localhost:5000/api/staff/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": 2,
    "username": "kh1",
    "amount": 999999,
    "type": "WITHDRAW"
  }'
# Expected: Trigger error ORA-20001
```

3. **Create valid DEPOSIT transaction**
```bash
curl -X POST http://localhost:5000/api/staff/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": 2,
    "username": "kh1",
    "amount": 50000,
    "type": "DEPOSIT"
  }'
# Save the returned transaction ID
```

4. **Login as Director (gd1)**
```bash
DIRECTOR_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"gd1","password":"123456"}' \
  | jq -r '.token')
```

5. **Approve transaction (Trigger auto updates balance)**
```bash
curl -X PUT http://localhost:5000/api/director/approve/TRANSACTION_ID \
  -H "Authorization: Bearer $DIRECTOR_TOKEN"
# Expected: Success message with balance change details
```

---

## 🛡️ VPD DEMO FLOW

### Test Row-Level Security:

1. **Login as Customer kh1**
```bash
KH1_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"kh1","password":"123456"}' \
  | jq -r '.token')
```

2. **View accounts (VPD filters to show only kh1's accounts)**
```bash
curl -X GET http://localhost:5000/api/customer/accounts \
  -H "Authorization: Bearer $KH1_TOKEN"
# Should only see accounts belonging to kh1
```

3. **Login as Staff nv1**
```bash
NV1_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"nv1","password":"123456"}' \
  | jq -r '.token')
```

4. **View all accounts (VPD allows staff to see all)**
```bash
curl -X GET http://localhost:5000/api/staff/accounts \
  -H "Authorization: Bearer $NV1_TOKEN"
# Should see ALL accounts
```

5. **View employee salaries (VPD filters - staff only sees own salary)**
```bash
curl -X GET http://localhost:5000/api/demo/vpd/employee-salary \
  -H "Authorization: Bearer $NV1_TOKEN"
# Should only see nv1's salary
```

6. **Login as Director gd1**
```bash
GD1_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"gd1","password":"123456"}' \
  | jq -r '.token')
```

7. **View all salaries (VPD allows director to see all)**
```bash
curl -X GET http://localhost:5000/api/demo/vpd/employee-salary \
  -H "Authorization: Bearer $GD1_TOKEN"
# Should see ALL salaries including director's own
```

---

## Notes:
- All timestamps are in ISO 8601 format
- Currency amounts are in VND (Vietnamese Dong)
- JW tokens expire after 24 hours (configured in JWT_EXPIRES_IN)
- Trigger errors return HTTP 400 with detailed trigger_info
- VPD policies are transparent to the application - filtering happens at database level
