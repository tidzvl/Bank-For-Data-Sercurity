-- Audit Trail Setup
-- Chạy với user admin trong PDB banking

-- Tạo Policy giám sát hành động trên 4 bảng
CREATE AUDIT POLICY giam_sat_banking
    ACTIONS ALL ON admin.customer_info,
            ALL ON admin.account_balance,
            ALL ON admin.transaction_log,
            ALL ON admin.employee_info;

-- Bật Policy cho tất cả user
AUDIT POLICY giam_sat_banking;

COMMIT;
