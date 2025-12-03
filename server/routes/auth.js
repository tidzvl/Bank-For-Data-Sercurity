import express from 'express';
import jwt from 'jsonwebtoken';
import { getUserConnection, closeConnection, executeQuery } from '../config/database.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  let connection;

  try {
    // Try to connect as the user (Oracle will validate credentials)
    connection = await getUserConnection(username.toLowerCase(), password);

    // Determine user role based on username prefix or query database
    let role = 'CUSTOMER';
    let userInfo = {};

    // Query to get user information
    const sql = `
      SELECT
        c.username,
        c.fullname,
        c.cccd,
        c.phone,
        'CUSTOMER' as role
      FROM admin.customer_info c
      WHERE UPPER(c.username) = UPPER(:username)
      UNION ALL
      SELECT
        e.emp_username as username,
        e.emp_username as fullname,
        NULL as cccd,
        NULL as phone,
        e.position as role
      FROM admin.employee_info e
      WHERE UPPER(e.emp_username) = UPPER(:username)
    `;

    const result = await executeQuery(connection, sql, { username });

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Map position to role
      if (user.ROLE === 'STAFF') {
        role = 'STAFF';
      } else if (user.ROLE === 'DIRECTOR') {
        role = 'DIRECTOR';
      } else {
        role = 'CUSTOMER';
      }

      userInfo = {
        username: user.USERNAME,
        fullname: user.FULLNAME || user.USERNAME,
        cccd: user.CCCD,
        phone: user.PHONE,
        role: role
      };
    } else {
      // User connected but not in our tables (e.g., admin)
      userInfo = {
        username: username.toLowerCase(),
        fullname: username.toUpperCase(),
        role: username.toLowerCase() === 'admin' ? 'ADMIN' : 'CUSTOMER'
      };
    }

    // If customer, get accounts info
    if (role === 'CUSTOMER') {
      const accountsSql = `
        SELECT id, balance, status
        FROM admin.account_balance
        WHERE UPPER(username) = UPPER(:username)
      `;
      const accountsResult = await executeQuery(connection, accountsSql, { username });
      userInfo.accounts = accountsResult.rows.map(acc => ({
        id: acc.ID,
        balance: acc.BALANCE,
        status: acc.STATUS
      }));
    }

    // If employee, get salary info
    if (role === 'STAFF' || role === 'DIRECTOR') {
      const empSql = `
        SELECT salary, position
        FROM admin.employee_info
        WHERE UPPER(emp_username) = UPPER(:username)
      `;
      const empResult = await executeQuery(connection, empSql, { username });
      if (empResult.rows.length > 0) {
        userInfo.salary = empResult.rows[0].SALARY;
        userInfo.position = empResult.rows[0].POSITION;
      }
    }

    // Generate JWT token
    const token = generateToken(userInfo);

    res.json({
      success: true,
      token,
      user: userInfo
    });

  } catch (err) {
    console.error('Login error:', err);

    if (err.message.includes('Invalid username or password')) {
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
    } else if (err.message.includes('Account is locked')) {
      return res.status(403).json({ error: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.' });
    } else if (err.message.includes('ORA-12154')) {
      return res.status(503).json({ error: 'Không thể kết nối tới database. Vui lòng kiểm tra cấu hình.' });
    }

    res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đăng nhập' });
  } finally {
    await closeConnection(connection);
  }
});

// POST /api/auth/verify - Verify token
router.post('/verify', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bm-bank-secret-key-2025');
    res.json({ success: true, user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;
