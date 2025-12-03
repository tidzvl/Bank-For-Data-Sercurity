#!/bin/bash

echo "🚀 BM Bank - Database Initialization Script"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Oracle container is running
echo -e "${YELLOW}Checking Oracle container status...${NC}"
if ! docker ps | grep -q bm-bank-oracle-db; then
    echo -e "${RED}❌ Oracle container is not running!${NC}"
    echo -e "${YELLOW}Starting Oracle container...${NC}"
    docker-compose up -d oracle-db
    echo -e "${YELLOW}Waiting for Oracle to be ready (this may take 2-3 minutes)...${NC}"
    sleep 120
fi

# Wait for Oracle to be healthy
echo -e "${YELLOW}Waiting for Oracle to be healthy...${NC}"
until docker exec bm-bank-oracle-db bash -c "echo 'SELECT 1 FROM DUAL;' | sqlplus -s system/Oracle123@localhost:1521/XE" > /dev/null 2>&1; do
    echo -e "${YELLOW}Oracle is not ready yet. Waiting...${NC}"
    sleep 10
done

echo -e "${GREEN}✅ Oracle is ready!${NC}"
echo ""

# Run initialization scripts
echo -e "${YELLOW}Running schema.sql...${NC}"
docker exec -i bm-bank-oracle-db bash -c "sqlplus -s system/Oracle123@localhost:1521/XE" < oracle-banking-db/sql/schema.sql
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Schema created successfully${NC}"
else
    echo -e "${RED}❌ Schema creation failed${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Running vpd-policies.sql...${NC}"
docker exec -i bm-bank-oracle-db bash -c "sqlplus -s system/Oracle123@localhost:1521/XE" < oracle-banking-db/sql/vpd-policies.sql
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ VPD policies created successfully${NC}"
else
    echo -e "${RED}❌ VPD policies creation failed${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Running audit-setup.sql...${NC}"
docker exec -i bm-bank-oracle-db bash -c "sqlplus -s system/Oracle123@localhost:1521/XE" < oracle-banking-db/sql/audit-setup.sql
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Audit setup completed successfully${NC}"
else
    echo -e "${RED}❌ Audit setup failed${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Running seed-data.sql...${NC}"
docker exec -i bm-bank-oracle-db bash -c "sqlplus -s system/Oracle123@localhost:1521/XE" < oracle-banking-db/sql/seed-data.sql
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Seed data loaded successfully${NC}"
else
    echo -e "${RED}❌ Seed data loading failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Database initialization completed successfully!${NC}"
echo ""
echo "Demo accounts:"
echo "  - Customer: kh1 / 123456 or kh2 / 123456"
echo "  - Staff: nv1 / 123456"
echo "  - Director: gd1 / 123456"
echo ""
echo "You can now access:"
echo "  - Frontend: http://localhost:5003"
echo "  - Backend API: http://localhost:5000"
echo "  - Oracle EM: https://localhost:5500/em"
