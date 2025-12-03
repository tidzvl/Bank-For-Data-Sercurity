import express from 'express';
import oracledb from 'oracledb';
import { getBankingConnection, closeConnection, executeQuery } from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require STAFF authentication
router.use(authenticateToken);
router.use(requireRole('STAFF'));

// GET /api/staff/customers - Get all customers
router.get('/customers', async (req, res) => {
  let connection;

  try {
    connection = await getBankingConnection();

    const sql = `
      SELECT username, fullname, cccd, phone
      FROM admin.customer_info
      ORDER BY username
    `;

    const result = await executeQuery(connection, sql);

    res.json({
      success: true,
      customers: result.rows.map(row => ({
        username: row.USERNAME,
        fullname: row.FULLNAME,
        cccd: row.CCCD,
        phone: row.PHONE
      }))
    });

  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: 'Không thể lấy danh sách khách hàng' });
  } finally {
    await closeConnection(connection);
  }
});

// POST /api/staff/customers - Create new customer
router.post('/customers', async (req, res) => {
  const { username, fullname, cccd, phone, password } = req.body;
  let connection;

  try {
    connection = await getBankingConnection();

    // Create user in Oracle
    const createUserSql = `
      BEGIN
        EXECUTE IMMEDIATE 'CREATE USER ${username} IDENTIFIED BY ${password}';
        EXECUTE IMMEDIATE 'GRANT CREATE SESSION TO ${username}';
        EXECUTE IMMEDIATE 'ALTER USER ${username} PROFILE banking_security';
      END;
    `;
    await executeQuery(connection, createUserSql);

    // Insert customer info
    const insertSql = `
      INSERT INTO admin.customer_info (username, fullname, cccd, phone)
      VALUES (:username, :fullname, :cccd, :phone)
    `;

    await executeQuery(connection, insertSql, { username, fullname, cccd, phone });

    // Grant permissions
    const grantSql = `
      BEGIN
        EXECUTE IMMEDIATE 'GRANT SELECT, UPDATE ON admin.customer_info TO ${username}';
        EXECUTE IMMEDIATE 'GRANT SELECT ON admin.account_balance TO ${username}';
        EXECUTE IMMEDIATE 'GRANT SELECT ON admin.transaction_log TO ${username}';
      END;
    `;
    await executeQuery(connection, grantSql);

    res.status(201).json({
      success: true,
      message: 'Tạo khách hàng thành công',
      customer: { username, fullname, cccd, phone }
    });

  } catch (err) {
    console.error('Error creating customer:', err);
    if (err.message.includes('ORA-01920')) {
      return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
    } else if (err.message.includes('ORA-02290')) {
      return res.status(400).json({ error: 'CCCD hoặc số điện thoại không hợp lệ' });
    }
    res.status(500).json({ error: 'Không thể tạo khách hàng' });
  } finally {
    await closeConnection(connection);
  }
});

// GET /api/staff/accounts - Get all accounts
router.get('/accounts', async (req, res) => {
  let connection;

  try {
    connection = await getBankingConnection();

    const sql = `
      SELECT a.id, a.username, a.balance, a.status, c.fullname
      FROM admin.account_balance a
      JOIN admin.customer_info c ON a.username = c.username
      ORDER BY a.id
    `;

    const result = await executeQuery(connection, sql);

    res.json({
      success: true,
      accounts: result.rows.map(row => ({
        id: row.ID,
        username: row.USERNAME,
        fullname: row.FULLNAME,
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

// POST /api/staff/accounts - Create new account for customer
router.post('/accounts', async (req, res) => {
  const { username, initial_balance = 0 } = req.body;
  let connection;

  try {
    connection = await getBankingConnection();

    const sql = `
      INSERT INTO admin.account_balance (username, balance, status)
      VALUES (:username, :initial_balance, 'active')
      RETURNING id INTO :id
    `;

    const result = await executeQuery(connection, sql, {
      username,
      initial_balance,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    });

    res.status(201).json({
      success: true,
      message: 'Tạo tài khoản thành công',
      account: {
        id: result.outBinds.id[0],
        username,
        balance: initial_balance,
        status: 'active'
      }
    });

  } catch (err) {
    console.error('Error creating account:', err);
    res.status(500).json({ error: 'Không thể tạo tài khoản' });
  } finally {
    await closeConnection(connection);
  }
});

// GET /api/staff/transactions - Get all transactions
router.get('/transactions', async (req, res) => {
  let connection;

  try {
    connection = await getBankingConnection();

    const sql = `
      SELECT t.id, t.account_id, t.username, t.amount, t.type, t.req_date, t.status,
             c.fullname
      FROM admin.transaction_log t
      JOIN admin.customer_info c ON t.username = c.username
      ORDER BY t.req_date DESC
    `;

    const result = await executeQuery(connection, sql);

    res.json({
      success: true,
      transactions: result.rows.map(row => ({
        id: row.ID,
        account_id: row.ACCOUNT_ID,
        username: row.USERNAME,
        fullname: row.FULLNAME,
        amount: row.AMOUNT,
        type: row.TYPE,
        req_date: row.REQ_DATE,
        status: row.STATUS
      }))
    });

  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Không thể lấy danh sách giao dịch' });
  } finally {
    await closeConnection(connection);
  }
});

// POST /api/staff/transactions - Create new transaction
router.post('/transactions', async (req, res) => {
  const { account_id, username, amount, type } = req.body;
  let connection;

  try {
    connection = await getBankingConnection();

    // Trigger trg_check_withdraw will automatically validate for WITHDRAW
    const sql = `
      INSERT INTO admin.transaction_log (account_id, username, amount, type, status)
      VALUES (:account_id, :username, :amount, :type, 'pending')
      RETURNING id INTO :id
    `;

    const result = await executeQuery(connection, sql, {
      account_id,
      username,
      amount,
      type,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    });

    res.status(201).json({
      success: true,
      message: 'Tạo phiếu giao dịch thành công',
      transaction: {
        id: result.outBinds.id[0],
        account_id,
        username,
        amount,
        type,
        status: 'pending'
      }
    });

  } catch (err) {
    console.error('Error creating transaction:', err);
    if (err.message.includes('ORA-20001')) {
      return res.status(400).json({ error: 'Số dư tài khoản không đủ!' });
    }
    res.status(500).json({ error: 'Không thể tạo giao dịch' });
  } finally {
    await closeConnection(connection);
  }
});

export default router;
