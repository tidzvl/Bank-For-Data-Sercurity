import express from 'express';
import { getBankingConnection, closeConnection, executeQuery } from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require DIRECTOR authentication
router.use(authenticateToken);
router.use(requireRole('DIRECTOR'));

// GET /api/director/pending-approvals - Get all pending transactions
router.get('/pending-approvals', async (req, res) => {
  let connection;

  try {
    connection = await getBankingConnection();

    const sql = `
      SELECT t.id, t.account_id, t.username, t.amount, t.type, t.req_date, t.status,
             c.fullname, a.balance as current_balance
      FROM admin.transaction_log t
      JOIN admin.customer_info c ON t.username = c.username
      JOIN admin.account_balance a ON t.account_id = a.id
      WHERE t.status = 'pending'
      ORDER BY t.req_date ASC
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
        status: row.STATUS,
        current_balance: row.CURRENT_BALANCE
      }))
    });

  } catch (err) {
    console.error('Error fetching pending approvals:', err);
    res.status(500).json({ error: 'Không thể lấy danh sách phiếu chờ duyệt' });
  } finally {
    await closeConnection(connection);
  }
});

// PUT /api/director/approve/:id - Approve transaction
router.put('/approve/:id', async (req, res) => {
  const { id } = req.params;
  let connection;

  try {
    connection = await getBankingConnection();

    // Get transaction details before approval
    const getTransSql = `
      SELECT t.id, t.account_id, t.amount, t.type, a.balance as old_balance
      FROM admin.transaction_log t
      JOIN admin.account_balance a ON t.account_id = a.id
      WHERE t.id = :id AND t.status = 'pending'
    `;
    const transResult = await executeQuery(connection, getTransSql, { id });

    if (transResult.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy phiếu hoặc phiếu đã được xử lý' });
    }

    const trans = transResult.rows[0];
    const oldBalance = trans.OLD_BALANCE;

    // Update status to 'accepted'
    // Trigger trg_update_balance will automatically update account balance
    const sql = `
      UPDATE admin.transaction_log
      SET status = 'accepted'
      WHERE id = :id AND status = 'pending'
    `;

    const result = await executeQuery(connection, sql, { id });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Không tìm thấy phiếu hoặc phiếu đã được xử lý' });
    }

    // Get new balance after trigger execution
    const getBalanceSql = `SELECT balance FROM admin.account_balance WHERE id = :account_id`;
    const balanceResult = await executeQuery(connection, getBalanceSql, { account_id: trans.ACCOUNT_ID });
    const newBalance = balanceResult.rows[0].BALANCE;

    res.json({
      success: true,
      message: '✅ TRIGGER TỰ ĐỘNG: Duyệt giao dịch thành công. Số dư đã được cập nhật tự động!',
      trigger_info: {
        name: 'trg_update_balance',
        type: 'AFTER UPDATE',
        description: 'Trigger tự động cập nhật số dư tài khoản khi duyệt giao dịch',
        action_performed: 'Tự động cập nhật số dư',
        transaction_type: trans.TYPE,
        amount: trans.AMOUNT,
        old_balance: oldBalance,
        new_balance: newBalance,
        balance_change: newBalance - oldBalance
      }
    });

  } catch (err) {
    console.error('Error approving transaction:', err);
    res.status(500).json({ error: 'Không thể duyệt giao dịch' });
  } finally {
    await closeConnection(connection);
  }
});

// PUT /api/director/reject/:id - Reject transaction
router.put('/reject/:id', async (req, res) => {
  const { id } = req.params;
  let connection;

  try {
    connection = await getBankingConnection();

    const sql = `
      UPDATE admin.transaction_log
      SET status = 'cancel'
      WHERE id = :id AND status = 'pending'
    `;

    const result = await executeQuery(connection, sql, { id });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Không tìm thấy phiếu hoặc phiếu đã được xử lý' });
    }

    res.json({
      success: true,
      message: 'Từ chối giao dịch thành công'
    });

  } catch (err) {
    console.error('Error rejecting transaction:', err);
    res.status(500).json({ error: 'Không thể từ chối giao dịch' });
  } finally {
    await closeConnection(connection);
  }
});

// GET /api/director/customers - Get all customers
router.get('/customers', async (req, res) => {
  let connection;

  try {
    connection = await getBankingConnection();

    const sql = `
      SELECT
        c.username,
        c.fullname,
        c.cccd,
        c.phone,
        COUNT(a.id) as account_count,
        COUNT(CASE WHEN a.status = 'active' THEN 1 END) as active_account_count
      FROM admin.customer_info c
      LEFT JOIN admin.account_balance a ON c.username = a.username
      GROUP BY c.username, c.fullname, c.cccd, c.phone
      ORDER BY c.username
    `;

    const result = await executeQuery(connection, sql);

    res.json({
      success: true,
      customers: result.rows.map(row => ({
        username: row.USERNAME,
        fullname: row.FULLNAME,
        cccd: row.CCCD,
        phone: row.PHONE,
        accountCount: row.ACCOUNT_COUNT,
        activeAccountCount: row.ACTIVE_ACCOUNT_COUNT
      }))
    });

  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: 'Không thể lấy danh sách khách hàng' });
  } finally {
    await closeConnection(connection);
  }
});

// GET /api/director/accounts - Get all accounts
router.get('/accounts', async (req, res) => {
  let connection;

  try {
    connection = await getBankingConnection();

    const sql = `
      SELECT
        a.id,
        a.username,
        a.balance,
        a.status,
        c.fullname
      FROM admin.account_balance a
      JOIN admin.customer_info c ON a.username = c.username
      ORDER BY a.id DESC
    `;

    const result = await executeQuery(connection, sql);

    res.json({
      success: true,
      accounts: result.rows.map(row => ({
        id: row.ID,
        account_number: `ACC${String(row.ID).padStart(12, '0')}`,
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

// GET /api/director/employees - Get all employees
router.get('/employees', async (req, res) => {
  let connection;

  try {
    connection = await getBankingConnection();

    // Director can see all salaries (no VPD restriction)
    const sql = `
      SELECT emp_username, salary, position
      FROM admin.employee_info
      ORDER BY position DESC, emp_username
    `;

    const result = await executeQuery(connection, sql);

    res.json({
      success: true,
      employees: result.rows.map(row => ({
        username: row.EMP_USERNAME,
        salary: row.SALARY,
        position: row.POSITION,
        status: 'active' // Default status - employees are assumed active
      }))
    });

  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Không thể lấy danh sách nhân viên' });
  } finally {
    await closeConnection(connection);
  }
});

// PUT /api/director/employees/:username - Update employee
router.put('/employees/:username', async (req, res) => {
  const { username } = req.params;
  const { salary, position } = req.body;
  let connection;

  try {
    connection = await getBankingConnection();

    const sql = `
      UPDATE admin.employee_info
      SET salary = :salary, position = :position
      WHERE UPPER(emp_username) = UPPER(:username)
    `;

    const result = await executeQuery(connection, sql, { salary, position, username });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin nhân viên thành công'
    });

  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ error: 'Không thể cập nhật thông tin nhân viên' });
  } finally {
    await closeConnection(connection);
  }
});

// PUT /api/director/accounts/:id/lock - Lock account
router.put('/accounts/:id/lock', async (req, res) => {
  const { id } = req.params;
  let connection;

  try {
    connection = await getBankingConnection();

    const sql = `
      UPDATE admin.account_balance
      SET status = 'locked'
      WHERE id = :id
    `;

    const result = await executeQuery(connection, sql, { id });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Không tìm thấy tài khoản' });
    }

    res.json({
      success: true,
      message: 'Khóa tài khoản thành công'
    });

  } catch (err) {
    console.error('Error locking account:', err);
    res.status(500).json({ error: 'Không thể khóa tài khoản' });
  } finally {
    await closeConnection(connection);
  }
});

// PUT /api/director/accounts/:id/unlock - Unlock account
router.put('/accounts/:id/unlock', async (req, res) => {
  const { id } = req.params;
  let connection;

  try {
    connection = await getBankingConnection();

    const sql = `
      UPDATE admin.account_balance
      SET status = 'active'
      WHERE id = :id
    `;

    const result = await executeQuery(connection, sql, { id });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Không tìm thấy tài khoản' });
    }

    res.json({
      success: true,
      message: 'Mở khóa tài khoản thành công'
    });

  } catch (err) {
    console.error('Error unlocking account:', err);
    res.status(500).json({ error: 'Không thể mở khóa tài khoản' });
  } finally {
    await closeConnection(connection);
  }
});

// GET /api/director/audit-trail - Get audit trail
router.get('/audit-trail', async (req, res) => {
  const { limit = 100, object_name } = req.query;
  let connection;

  try {
    connection = await getBankingConnection();

    let sql = `
      SELECT event_timestamp, dbusername, action_name, object_name, sql_text
      FROM unified_audit_trail
      WHERE object_name IN ('CUSTOMER_INFO', 'TRANSACTION_LOG', 'ACCOUNT_BALANCE', 'EMPLOYEE_INFO')
    `;

    const binds = {};

    if (object_name) {
      sql += ` AND object_name = :object_name`;
      binds.object_name = object_name.toUpperCase();
    }

    sql += ` ORDER BY event_timestamp DESC FETCH FIRST :limit ROWS ONLY`;
    binds.limit = parseInt(limit);

    const result = await executeQuery(connection, sql, binds);

    res.json({
      success: true,
      audit_log: result.rows.map(row => ({
        timestamp: row.EVENT_TIMESTAMP,
        user: row.DBUSERNAME,
        action: row.ACTION_NAME,
        object: row.OBJECT_NAME,
        sql: row.SQL_TEXT
      }))
    });

  } catch (err) {
    console.error('Error fetching audit trail:', err);
    res.status(500).json({ error: 'Không thể lấy audit trail' });
  } finally {
    await closeConnection(connection);
  }
});

// GET /api/director/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
  let connection;

  try {
    connection = await getBankingConnection();

    // Get multiple stats in one query
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM admin.customer_info) as total_customers,
        (SELECT COUNT(*) FROM admin.account_balance) as total_accounts,
        (SELECT COUNT(*) FROM admin.transaction_log WHERE status = 'pending') as pending_transactions,
        (SELECT COUNT(*) FROM admin.employee_info) as total_employees,
        (SELECT NVL(SUM(balance), 0) FROM admin.account_balance) as total_balance,
        (SELECT COUNT(*) FROM admin.transaction_log WHERE TRUNC(req_date) = TRUNC(SYSDATE)) as today_transactions
      FROM dual
    `;

    const result = await executeQuery(connection, sql);
    const stats = result.rows[0];

    res.json({
      success: true,
      stats: {
        totalCustomers: stats.TOTAL_CUSTOMERS,
        totalAccounts: stats.TOTAL_ACCOUNTS,
        pendingTransactions: stats.PENDING_TRANSACTIONS,
        totalEmployees: stats.TOTAL_EMPLOYEES,
        totalBalance: stats.TOTAL_BALANCE,
        todayTransactions: stats.TODAY_TRANSACTIONS
      }
    });

  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Không thể lấy thống kê' });
  } finally {
    await closeConnection(connection);
  }
});

export default router;
