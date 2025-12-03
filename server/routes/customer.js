import express from 'express';
import { getUserConnection, closeConnection, executeQuery } from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);
router.use(requireRole('CUSTOMER'));

// GET /api/customer/accounts - Get all accounts for logged-in customer
router.get('/accounts', async (req, res) => {
  let connection;

  try {
    connection = await getUserConnection(req.user.username, req.body.password || '123456');

    // VPD will automatically filter to show only user's accounts
    const sql = `
      SELECT id, username, balance, status
      FROM admin.account_balance
      ORDER BY id
    `;

    const result = await executeQuery(connection, sql);

    res.json({
      success: true,
      accounts: result.rows.map(row => ({
        id: row.ID,
        username: row.USERNAME,
        balance: row.BALANCE,
        status: row.STATUS
      }))
    });

  } catch (err) {
    console.error('Error fetching accounts:', err);
    res.status(500).json({ error: 'Không thể lấy danh sách tài khoản' });
  } finally {
    await closeConnection(connection);
  }
});

// GET /api/customer/accounts/:id - Get specific account details
router.get('/accounts/:id', async (req, res) => {
  const { id } = req.params;
  let connection;

  try {
    connection = await getUserConnection(req.user.username, req.body.password || '123456');

    const sql = `
      SELECT id, username, balance, status
      FROM admin.account_balance
      WHERE id = :id
    `;

    const result = await executeQuery(connection, sql, { id });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy tài khoản hoặc bạn không có quyền truy cập' });
    }

    res.json({
      success: true,
      account: {
        id: result.rows[0].ID,
        username: result.rows[0].USERNAME,
        balance: result.rows[0].BALANCE,
        status: result.rows[0].STATUS
      }
    });

  } catch (err) {
    console.error('Error fetching account:', err);
    res.status(500).json({ error: 'Không thể lấy thông tin tài khoản' });
  } finally {
    await closeConnection(connection);
  }
});

// GET /api/customer/transactions - Get transaction history
router.get('/transactions', async (req, res) => {
  let connection;

  try {
    connection = await getUserConnection(req.user.username, req.body.password || '123456');

    // VPD will automatically filter to show only user's transactions
    const sql = `
      SELECT id, account_id, username, amount, type, req_date, status
      FROM admin.transaction_log
      ORDER BY req_date DESC
    `;

    const result = await executeQuery(connection, sql);

    res.json({
      success: true,
      transactions: result.rows.map(row => ({
        id: row.ID,
        account_id: row.ACCOUNT_ID,
        username: row.USERNAME,
        amount: row.AMOUNT,
        type: row.TYPE,
        req_date: row.REQ_DATE,
        status: row.STATUS
      }))
    });

  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Không thể lấy lịch sử giao dịch' });
  } finally {
    await closeConnection(connection);
  }
});

// GET /api/customer/profile - Get customer profile
router.get('/profile', async (req, res) => {
  let connection;

  try {
    connection = await getUserConnection(req.user.username, req.body.password || '123456');

    const sql = `
      SELECT username, fullname, cccd, phone
      FROM admin.customer_info
      WHERE UPPER(username) = UPPER(:username)
    `;

    const result = await executeQuery(connection, sql, { username: req.user.username });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin khách hàng' });
    }

    res.json({
      success: true,
      profile: {
        username: result.rows[0].USERNAME,
        fullname: result.rows[0].FULLNAME,
        cccd: result.rows[0].CCCD,
        phone: result.rows[0].PHONE
      }
    });

  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Không thể lấy thông tin hồ sơ' });
  } finally {
    await closeConnection(connection);
  }
});

// PUT /api/customer/profile - Update customer profile
router.put('/profile', async (req, res) => {
  const { fullname, phone } = req.body;
  let connection;

  try {
    connection = await getUserConnection(req.user.username, req.body.password || '123456');

    const sql = `
      UPDATE admin.customer_info
      SET fullname = :fullname, phone = :phone
      WHERE UPPER(username) = UPPER(:username)
    `;

    await executeQuery(connection, sql, {
      fullname,
      phone,
      username: req.user.username
    });

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công'
    });

  } catch (err) {
    console.error('Error updating profile:', err);
    if (err.message.includes('ORA-02290')) {
      return res.status(400).json({ error: 'Số điện thoại không hợp lệ (phải là 10 số)' });
    }
    res.status(500).json({ error: 'Không thể cập nhật thông tin' });
  } finally {
    await closeConnection(connection);
  }
});

export default router;
