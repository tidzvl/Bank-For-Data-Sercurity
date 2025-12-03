-- Test Scripts for Banking Database

-- ============================================
-- Test 1: Constraints
-- ============================================
PROMPT Testing constraints...

-- Test insert sai SĐT (Kỳ vọng LỖI)
PROMPT Test: Insert invalid phone number
BEGIN
    INSERT INTO customer_info VALUES ('test_user', 'Test Name', '000000000001', 'abc');
    DBMS_OUTPUT.PUT_LINE('ERROR: Should have failed!');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('PASS: Constraint blocked invalid phone');
        ROLLBACK;
END;
/

-- ============================================
-- Test 2: Triggers
-- ============================================
PROMPT Testing triggers...

-- Test rút tiền từ tài khoản không đủ (Kỳ vọng LỖI)
PROMPT Test: Withdraw from insufficient balance
BEGIN
    INSERT INTO transaction_log (account_id, username, amount, type)
    VALUES (1, 'kh1', 100000, 'WITHDRAW');
    DBMS_OUTPUT.PUT_LINE('ERROR: Should have failed!');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('PASS: Trigger blocked insufficient withdrawal');
        ROLLBACK;
END;
/

-- Test rút tiền hợp lệ
PROMPT Test: Valid withdrawal
INSERT INTO transaction_log (account_id, username, amount, type)
VALUES (2, 'kh1', 100000, 'WITHDRAW');
DBMS_OUTPUT.PUT_LINE('Transaction created (pending)');

-- Test duyệt phiếu
PROMPT Test: Accept transaction
UPDATE transaction_log SET status = 'accepted' WHERE account_id = 2 AND status = 'pending';
DBMS_OUTPUT.PUT_LINE('Transaction accepted');

-- Kiểm tra số dư
PROMPT Check balance after transaction:
SELECT id, username, balance FROM account_balance WHERE username = 'kh1';

ROLLBACK;

-- ============================================
-- Test 3: VPD Policies
-- ============================================
PROMPT Testing VPD policies...
PROMPT Note: Run these tests separately with different users:

PROMPT -- Test as KH1 (should see only own accounts):
PROMPT -- CONN kh1/123456@localhost:1521/banking
PROMPT -- SELECT * FROM admin.account_balance;

PROMPT -- Test as KH2 (should see only own accounts):
PROMPT -- CONN kh2/123456@localhost:1521/banking
PROMPT -- SELECT * FROM admin.account_balance;

PROMPT -- Test as NV1 (should see salary only for self):
PROMPT -- CONN nv1/123456@localhost:1521/banking
PROMPT -- SELECT * FROM admin.employee_info;

PROMPT -- Test as GD1 (should see all):
PROMPT -- CONN gd1/123456@localhost:1521/banking
PROMPT -- SELECT * FROM admin.employee_info;

-- ============================================
-- Test 4: Audit
-- ============================================
PROMPT Testing audit...
PROMPT Perform some operations then check audit trail:

-- Do some operations
SELECT * FROM account_balance;
INSERT INTO transaction_log (account_id, username, amount, type)
VALUES (1, 'kh1', 50000, 'DEPOSIT');
ROLLBACK;

-- Check audit trail
PROMPT Check audit trail:
SELECT
    event_timestamp,
    dbusername,
    action_name,
    object_name,
    sql_text
FROM unified_audit_trail
WHERE object_name IN ('CUSTOMER_INFO', 'TRANSACTION_LOG', 'ACCOUNT_BALANCE', 'EMPLOYEE_INFO')
ORDER BY event_timestamp DESC
FETCH FIRST 10 ROWS ONLY;

-- ============================================
-- Summary
-- ============================================
PROMPT ============================================
PROMPT Test Summary:
PROMPT 1. Constraints: Tested phone validation
PROMPT 2. Triggers: Tested withdraw validation and balance update
PROMPT 3. VPD: Manual test required with different users
PROMPT 4. Audit: Check unified_audit_trail for records
PROMPT ============================================
