#!/bin/bash
# Script tự động setup banking database

echo "Waiting for Oracle Database to be ready..."
sleep 30

echo "Setting up banking database in FREEPDB1..."

# Create admin user in FREEPDB1
sqlplus -s system/Oracle123@localhost:1521/FREEPDB1 <<EOF
-- Create admin user
CREATE USER admin IDENTIFIED BY 123456;
GRANT CONNECT, RESOURCE, DBA TO admin;
GRANT UNLIMITED TABLESPACE TO admin;

exit;
EOF

echo "Admin user created successfully!"

# Run other setup scripts
echo "Running schema setup..."
sqlplus -s admin/123456@localhost:1521/FREEPDB1 @/opt/oracle/sql/schema.sql

echo "Running VPD policies setup..."
sqlplus -s admin/123456@localhost:1521/FREEPDB1 @/opt/oracle/sql/vpd-policies.sql

echo "Running audit setup..."
sqlplus -s admin/123456@localhost:1521/FREEPDB1 @/opt/oracle/sql/audit-setup.sql

echo "Loading seed data..."
sqlplus -s admin/123456@localhost:1521/FREEPDB1 @/opt/oracle/sql/seed-data.sql

echo "Banking database setup completed!"
