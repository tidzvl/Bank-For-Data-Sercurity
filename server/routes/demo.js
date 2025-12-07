import express from 'express';
import { getUserConnection, getBankingConnection, closeConnection, executeQuery } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * TRIGGER DEMO ENDPOINTS
 */

// POST /api/demo/trigger/withdraw - Demo trg_check_withdraw (trigger lỗi khi rút tiền không đủ)
router.post('/trigger/withdraw', async (req, res) => {
  const { account_id, amount } = req.body;
  let connection;

  try {
    connection = await getBankingConnection();

    // Get current balance
    const balanceQuery = `
      SELECT id, username, balance, status
      FROM admin.account_balance
      WHERE id = :account_id
    `;
    const balanceResult = await executeQuery(connection, balanceQuery, { account_id });

    if (balanceResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Không tìm thấy tài khoản',
        demo_type: 'TRIGGER_ERROR'
      });
    }

    const account = balanceResult.rows[0];

    // Try to create withdraw transaction (trigger sẽ chặn nếu không đủ tiền)
    const insertQuery = `
      INSERT INTO admin.transaction_log (account_id, username, amount, type, status)
      VALUES (:account_id, :username, :amount, 'WITHDRAW', 'pending')
      RETURNING id INTO :id
    `;

    try {
      const result = await executeQuery(connection, insertQuery, {
        account_id,
        username: account.USERNAME,
        amount,
        id: { dir: 2, type: 2002 } // BIND_OUT, NUMBER
      });

      // Success - trigger không chặn
      res.json({
        success: true,
        message: `Tạo phiếu rút ${amount.toLocaleString('vi-VN')} VNĐ thành công!`,
        transaction_id: result.outBinds.id[0],
        demo_type: 'TRIGGER_SUCCESS',
        trigger_info: {
          trigger_name: 'trg_check_withdraw',
          check_performed: 'Kiểm tra số dư',
          current_balance: account.BALANCE,
          withdraw_amount: amount,
          result: 'PASSED - Số dư đủ để rút'
        }
      });

    } catch (triggerError) {
      // Trigger chặn - ORA-20001
      if (triggerError.message.includes('ORA-20001')) {
        return res.status(400).json({
          error: 'Trigger chặn giao dịch: Số dư tài khoản không đủ!',
          demo_type: 'TRIGGER_ERROR',
          trigger_info: {
            trigger_name: 'trg_check_withdraw',
            check_performed: 'Kiểm tra số dư',
            current_balance: account.BALANCE,
            withdraw_amount: amount,
            result: 'BLOCKED - Số dư không đủ',
            error_code: 'ORA-20001',
            error_message: triggerError.message
          },
          account_info: {
            id: account.ID,
            balance: account.BALANCE,
            status: account.STATUS
          }
        });
      }
      throw triggerError;
    }

  } catch (err) {
    console.error('Error in trigger demo:', err);
    res.status(500).json({
      error: 'Lỗi hệ thống',
      details: err.message
    });
  } finally {
    await closeConnection(connection);
  }
});

// POST /api/demo/trigger/approve - Demo trg_update_balance (tự động cập nhật số dư khi duyệt)
router.post('/trigger/approve/:id', async (req, res) => {
  const { id } = req.params;
  let connection;

  try {
    connection = await getBankingConnection();

    // Get transaction info before approval
    const transQuery = `
      SELECT t.id, t.account_id, t.username, t.amount, t.type, t.status,
             a.balance as current_balance
      FROM admin.transaction_log t
      JOIN admin.account_balance a ON t.account_id = a.id
      WHERE t.id = :id
    `;
    const transResult = await executeQuery(connection, transQuery, { id });

    if (transResult.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy giao dịch' });
    }

    const trans = transResult.rows[0];
    const balanceBefore = trans.CURRENT_BALANCE;

    if (trans.STATUS !== 'pending') {
      return res.status(400).json({
        error: 'Giao dịch đã được xử lý',
        current_status: trans.STATUS
      });
    }

    // Approve transaction - trigger sẽ tự động cập nhật số dư
    const approveQuery = `
      UPDATE admin.transaction_log
      SET status = 'accepted'
      WHERE id = :id
    `;
    await executeQuery(connection, approveQuery, { id });

    // Get updated balance
    const balanceQuery = `
      SELECT balance FROM admin.account_balance WHERE id = :account_id
    `;
    const balanceResult = await executeQuery(connection, balanceQuery, { account_id: trans.ACCOUNT_ID });
    const balanceAfter = balanceResult.rows[0].BALANCE;

    res.json({
      success: true,
      message: 'Duyệt giao dịch thành công! Trigger đã tự động cập nhật số dư.',
      demo_type: 'TRIGGER_SUCCESS',
      trigger_info: {
        trigger_name: 'trg_update_balance',
        trigger_type: 'AFTER UPDATE',
        auto_action: 'Tự động cập nhật số dư tài khoản',
        transaction_type: trans.TYPE,
        amount: trans.AMOUNT,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        balance_change: balanceAfter - balanceBefore,
        result: 'SUCCESS - Số dư đã được cập nhật tự động'
      },
      transaction: {
        id: trans.ID,
        account_id: trans.ACCOUNT_ID,
        amount: trans.AMOUNT,
        type: trans.TYPE,
        new_status: 'accepted'
      }
    });

  } catch (err) {
    console.error('Error in trigger approve demo:', err);
    res.status(500).json({
      error: 'Lỗi hệ thống',
      details: err.message
    });
  } finally {
    await closeConnection(connection);
  }
});

/**
 * VPD DEMO ENDPOINTS
 */

// GET /api/demo/vpd/customer-data - Demo VPD fn_auth_customer (khách hàng chỉ thấy data của mình)
router.get('/vpd/customer-data', async (req, res) => {
  let connection;

  try {
    // Connect as the current user (kh1, kh2, nv1, or gd1)
    connection = await getUserConnection(req.user.username, '123456');

    // Query all tables with VPD policy
    const queries = {
      customer_info: 'SELECT * FROM admin.customer_info',
      account_balance: 'SELECT * FROM admin.account_balance',
      transaction_log: 'SELECT * FROM admin.transaction_log'
    };

    const results = {};
    for (const [table, query] of Object.entries(queries)) {
      try {
        const result = await executeQuery(connection, query);
        results[table] = {
          success: true,
          rows: result.rows,
          count: result.rows.length
        };
      } catch (err) {
        results[table] = {
          success: false,
          error: err.message
        };
      }
    }

    res.json({
      success: true,
      demo_type: 'VPD_CUSTOMER_DATA',
      vpd_info: {
        policy_name: 'pol_cust_info, pol_cust_acc, pol_cust_trans',
        function_name: 'fn_auth_customer',
        description: 'Khách hàng chỉ thấy dữ liệu của chính mình. NV/GD thấy tất cả.',
        current_user: req.user.username.toUpperCase(),
        user_role: req.user.role,
        filter_applied: req.user.role === 'CUSTOMER'
          ? `UPPER(username) = '${req.user.username.toUpperCase()}'`
          : 'NULL (không lọc)'
      },
      data: results
    });

  } catch (err) {
    console.error('Error in VPD customer data demo:', err);
    res.status(500).json({
      error: 'Lỗi hệ thống',
      details: err.message
    });
  } finally {
    await closeConnection(connection);
  }
});

// GET /api/demo/vpd/employee-salary - Demo VPD fn_auth_salary (NV chỉ thấy lương của mình, GD thấy tất cả)
router.get('/vpd/employee-salary', async (req, res) => {
  let connection;

  try {
    connection = await getUserConnection(req.user.username, '123456');

    const query = 'SELECT emp_username, salary, position FROM admin.employee_info';

    try {
      const result = await executeQuery(connection, query);

      res.json({
        success: true,
        demo_type: 'VPD_EMPLOYEE_SALARY',
        vpd_info: {
          policy_name: 'pol_emp_salary',
          function_name: 'fn_auth_salary',
          description: 'Nhân viên chỉ thấy lương của mình. Giám đốc thấy lương tất cả.',
          current_user: req.user.username.toUpperCase(),
          user_role: req.user.role,
          filter_applied: req.user.role === 'STAFF'
            ? `UPPER(emp_username) = '${req.user.username.toUpperCase()}'`
            : 'NULL (không lọc)',
          sec_relevant_cols: 'SALARY',
          sec_relevant_cols_opt: 'ALL_ROWS'
        },
        data: {
          employees: result.rows.map(row => ({
            username: row.EMP_USERNAME,
            salary: row.SALARY,
            position: row.POSITION
          })),
          count: result.rows.length
        }
      });

    } catch (queryError) {
      // User không có quyền truy cập
      res.status(403).json({
        success: false,
        demo_type: 'VPD_ACCESS_DENIED',
        vpd_info: {
          policy_name: 'pol_emp_salary',
          current_user: req.user.username.toUpperCase(),
          user_role: req.user.role,
          result: 'ACCESS DENIED - User không có quyền truy cập bảng employee_info'
        },
        error: 'Bạn không có quyền xem thông tin nhân viên',
        details: queryError.message
      });
    }

  } catch (err) {
    console.error('Error in VPD salary demo:', err);
    res.status(500).json({
      error: 'Lỗi hệ thống',
      details: err.message
    });
  } finally {
    await closeConnection(connection);
  }
});

// GET /api/demo/vpd/test-all - Test tất cả VPD policies
router.get('/vpd/test-all', async (req, res) => {
  let connection;

  try {
    connection = await getUserConnection(req.user.username, '123456');

    const tests = [];

    // Test 1: Customer Info
    try {
      const result = await executeQuery(connection, 'SELECT * FROM admin.customer_info');
      tests.push({
        table: 'CUSTOMER_INFO',
        policy: 'pol_cust_info',
        success: true,
        rows_returned: result.rows.length,
        sample_data: result.rows.slice(0, 2)
      });
    } catch (err) {
      tests.push({
        table: 'CUSTOMER_INFO',
        policy: 'pol_cust_info',
        success: false,
        error: err.message
      });
    }

    // Test 2: Account Balance
    try {
      const result = await executeQuery(connection, 'SELECT * FROM admin.account_balance');
      tests.push({
        table: 'ACCOUNT_BALANCE',
        policy: 'pol_cust_acc',
        success: true,
        rows_returned: result.rows.length,
        sample_data: result.rows.slice(0, 2)
      });
    } catch (err) {
      tests.push({
        table: 'ACCOUNT_BALANCE',
        policy: 'pol_cust_acc',
        success: false,
        error: err.message
      });
    }

    // Test 3: Transaction Log
    try {
      const result = await executeQuery(connection, 'SELECT * FROM admin.transaction_log');
      tests.push({
        table: 'TRANSACTION_LOG',
        policy: 'pol_cust_trans',
        success: true,
        rows_returned: result.rows.length,
        sample_data: result.rows.slice(0, 2)
      });
    } catch (err) {
      tests.push({
        table: 'TRANSACTION_LOG',
        policy: 'pol_cust_trans',
        success: false,
        error: err.message
      });
    }

    // Test 4: Employee Info
    try {
      const result = await executeQuery(connection, 'SELECT * FROM admin.employee_info');
      tests.push({
        table: 'EMPLOYEE_INFO',
        policy: 'pol_emp_salary',
        success: true,
        rows_returned: result.rows.length,
        sample_data: result.rows.slice(0, 2)
      });
    } catch (err) {
      tests.push({
        table: 'EMPLOYEE_INFO',
        policy: 'pol_emp_salary',
        success: false,
        error: err.message
      });
    }

    res.json({
      success: true,
      demo_type: 'VPD_TEST_ALL',
      user_info: {
        username: req.user.username.toUpperCase(),
        role: req.user.role
      },
      tests,
      summary: {
        total_tests: tests.length,
        passed: tests.filter(t => t.success).length,
        failed: tests.filter(t => !t.success).length
      }
    });

  } catch (err) {
    console.error('Error in VPD test all:', err);
    res.status(500).json({
      error: 'Lỗi hệ thống',
      details: err.message
    });
  } finally {
    await closeConnection(connection);
  }
});

export default router;
