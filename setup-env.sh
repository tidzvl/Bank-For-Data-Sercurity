#!/bin/bash

echo "🔧 BM Bank - Environment Setup Script"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo -e "${RED}❌ .env.example not found!${NC}"
    exit 1
fi

# Setup Frontend .env
echo -e "${YELLOW}Setting up Frontend environment...${NC}"
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env already exists. Backup to .env.backup${NC}"
    cp .env .env.backup
fi

cp .env.example .env
echo -e "${GREEN}✅ Frontend .env created from .env.example${NC}"

# Setup Backend .env
echo ""
echo -e "${YELLOW}Setting up Backend environment...${NC}"
if [ ! -f "server/.env.example" ]; then
    echo -e "${RED}❌ server/.env.example not found!${NC}"
    exit 1
fi

if [ -f "server/.env" ]; then
    echo -e "${YELLOW}⚠️  server/.env already exists. Backup to server/.env.backup${NC}"
    cp server/.env server/.env.backup
fi

cp server/.env.example server/.env
echo -e "${GREEN}✅ Backend .env created from server/.env.example${NC}"

# Generate JWT Secret
echo ""
echo -e "${YELLOW}Generating secure JWT secret...${NC}"
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" 2>/dev/null)

if [ -z "$JWT_SECRET" ]; then
    echo -e "${YELLOW}⚠️  Node.js not found or crypto module unavailable${NC}"
    echo -e "${YELLOW}Using OpenSSL to generate secret...${NC}"
    JWT_SECRET=$(openssl rand -hex 64 2>/dev/null)
fi

if [ -n "$JWT_SECRET" ]; then
    # Update JWT_SECRET in server/.env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|g" server/.env
    else
        # Linux
        sed -i "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|g" server/.env
    fi
    echo -e "${GREEN}✅ JWT Secret generated and updated${NC}"
else
    echo -e "${RED}❌ Failed to generate JWT secret. Please set it manually.${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Environment setup complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Review and customize .env files:"
echo "   - .env (Frontend)"
echo "   - server/.env (Backend)"
echo ""
echo "2. Update database credentials if needed:"
echo "   - ORACLE_PASSWORD"
echo "   - BANKING_ADMIN_PASSWORD"
echo ""
echo "3. Start development servers:"
echo "   Frontend: npm run dev"
echo "   Backend:  cd server && npm run dev"
echo ""
echo "4. Or use Docker:"
echo "   docker-compose up -d --build"
echo ""
echo -e "${YELLOW}⚠️  Important: Never commit .env files to git!${NC}"
echo ""
