#!/bin/bash
# Script tự động setup banking database

echo "Waiting for Oracle Database to be ready..."
sleep 30

echo "Creating PDB and setting up banking database..."

sqlplus -s system/Oracle123@localhost:1521/XE <<EOF
-- Enable audit trail
ALTER SYSTEM SET AUDIT_TRAIL=DB SCOPE=SPFILE;
SHUTDOWN IMMEDIATE;
STARTUP;

-- Create PDB
CREATE PLUGGABLE DATABASE banking
ADMIN USER admin IDENTIFIED BY 123456
ROLES = (DBA)
FILE_NAME_CONVERT = ('pdbseed', 'banking');

ALTER PLUGGABLE DATABASE banking OPEN;
ALTER PLUGGABLE DATABASE banking SAVE STATE;

exit;
EOF

echo "PDB banking created successfully!"

# Run other setup scripts
echo "Running schema setup..."
sqlplus -s admin/123456@localhost:1521/banking @/opt/oracle/sql/schema.sql

echo "Running VPD policies setup..."
sqlplus -s admin/123456@localhost:1521/banking @/opt/oracle/sql/vpd-policies.sql

echo "Running audit setup..."
sqlplus -s admin/123456@localhost:1521/banking @/opt/oracle/sql/audit-setup.sql

echo "Loading seed data..."
sqlplus -s admin/123456@localhost:1521/banking @/opt/oracle/sql/seed-data.sql

echo "Banking database setup completed!"
