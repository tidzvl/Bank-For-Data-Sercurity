-- Seed Data for Banking Database
-- Chạy với user admin trong PDB banking

-- Insert customers
INSERT INTO customer_info VALUES ('kh1', 'Nguyen Van A', '012345678901', '0901234567');
INSERT INTO customer_info VALUES ('kh2', 'Tran Van B', '098765432109', '0912345678');

-- Insert accounts
INSERT INTO account_balance (username, balance) VALUES ('kh1', 0);
INSERT INTO account_balance (username, balance) VALUES ('kh1', 500000);
INSERT INTO account_balance (username, balance) VALUES ('kh2', 200000);

-- Insert employees
INSERT INTO employee_info VALUES ('nv1', 1000, 'STAFF');
INSERT INTO employee_info VALUES ('gd1', 5000, 'DIRECTOR');

COMMIT;
