# Oracle Banking Database Setup

Project con này chứa Oracle Database setup cho hệ thống ngân hàng với Docker.

## Cấu trúc thư mục

```
oracle-banking-db/
├── docker-compose.yml          # Docker compose configuration
├── init-scripts/               # Scripts tự động chạy khi khởi tạo
│   └── 01-setup.sql           # Script setup ban đầu
├── sql/                        # SQL scripts
│   ├── schema.sql             # Tạo tables và triggers
│   ├── vpd-policies.sql       # Virtual Private Database policies
│   ├── audit-setup.sql        # Audit configuration
│   ├── seed-data.sql          # Dữ liệu mẫu
│   └── test-scripts.sql       # Scripts để test
└── README.md
```

## Yêu cầu

- Docker Desktop
- 4GB RAM trở lên cho Oracle XE
- Port 1521 và 5500 phải trống

## Cài đặt

### 1. Khởi động Oracle Database

```bash
cd oracle-banking-db
docker-compose up -d
```

### 2. Kiểm tra trạng thái

```bash
docker-compose ps
docker logs oracle-banking-db
```

Database sẽ mất 2-3 phút để khởi động lần đầu.

### 3. Kết nối tới database

**Thông tin kết nối:**
- Host: `localhost`
- Port: `1521`
- SID: `XE`
- System Password: `Oracle123`
- PDB Name: `banking` (sau khi chạy init scripts)

**Kết nối bằng SQL*Plus:**

```bash
# Kết nối vào container
docker exec -it oracle-banking-db bash

# Kết nối system
sqlplus system/Oracle123@localhost:1521/XE

# Kết nối vào PDB banking (sau khi setup)
sqlplus admin/123456@localhost:1521/banking
```

**Kết nối bằng SQL Developer/DBeaver:**
```
Connection Type: Oracle
Host: localhost
Port: 1521
Service Name: XE
Username: system
Password: Oracle123
```

### 4. Chạy setup scripts

Sau khi database đã sẵn sàng, chạy các scripts theo thứ tự:

```bash
# Vào container
docker exec -it oracle-banking-db bash

# Chạy setup script
sqlplus system/Oracle123@localhost:1521/XE @/opt/oracle/sql/schema.sql
sqlplus admin/123456@localhost:1521/banking @/opt/oracle/sql/vpd-policies.sql
sqlplus admin/123456@localhost:1521/banking @/opt/oracle/sql/audit-setup.sql
sqlplus admin/123456@localhost:1521/banking @/opt/oracle/sql/seed-data.sql
```

Hoặc chạy script tự động:

```bash
docker exec -it oracle-banking-db bash /opt/oracle/scripts/startup/01-setup.sh
```

## Cấu trúc Database

### Users
- `admin` (password: 123456) - Admin của PDB banking
- `kh1`, `kh2` - Khách hàng
- `nv1` - Nhân viên
- `gd1` - Giám đốc

### Tables
1. **customer_info** - Thông tin khách hàng
2. **account_balance** - Tài khoản và số dư
3. **transaction_log** - Lịch sử giao dịch
4. **employee_info** - Thông tin nhân viên

### Tính năng bảo mật

1. **VPD (Virtual Private Database)**
   - Khách hàng chỉ thấy dữ liệu của mình
   - Nhân viên chỉ thấy lương của mình
   - Giám đốc thấy toàn bộ

2. **Audit Trail**
   - Ghi lại tất cả hành động trên 4 bảng
   - Xem audit: `SELECT * FROM unified_audit_trail`

3. **Password Security Profile**
   - Khóa sau 3 lần nhập sai
   - Mật khẩu hết hạn sau 90 ngày
   - Không được dùng lại mật khẩu cũ

4. **Triggers**
   - Kiểm tra số dư trước khi rút tiền
   - Tự động cập nhật số dư khi duyệt giao dịch

## Test

Chạy test scripts:

```bash
sqlplus admin/123456@localhost:1521/banking @/opt/oracle/sql/test-scripts.sql
```

## Quản lý

### Dừng database
```bash
docker-compose stop
```

### Xóa và reset lại database
```bash
docker-compose down -v
docker-compose up -d
```

### Xem logs
```bash
docker logs -f oracle-banking-db
```

### Backup database
```bash
docker exec oracle-banking-db bash -c "expdp system/Oracle123@XE full=y directory=DATA_PUMP_DIR dumpfile=banking_backup.dmp"
```

## Troubleshooting

### Database không khởi động
- Kiểm tra RAM: Oracle XE cần ít nhất 4GB
- Kiểm tra port 1521 có bị chiếm không
- Xem logs: `docker logs oracle-banking-db`

### Kết nối bị từ chối
- Đợi database khởi động hoàn toàn (2-3 phút)
- Kiểm tra healthcheck: `docker-compose ps`

### Script chạy lỗi
- Đảm bảo chạy theo đúng thứ tự
- Kết nối đúng user và PDB
- Kiểm tra privileges của user

## Web Interface

Oracle XE có sẵn Enterprise Manager:
- URL: https://localhost:5500/em
- Username: system
- Password: Oracle123
