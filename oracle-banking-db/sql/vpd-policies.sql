-- Virtual Private Database Policies Setup
-- Chạy với user admin trong PDB banking

-- VPD1: Policy cho Khách hàng
CREATE OR REPLACE FUNCTION fn_auth_customer (
    p_schema IN VARCHAR2,
    p_object IN VARCHAR2
) RETURN VARCHAR2 AS
    v_user VARCHAR2(30);
BEGIN
    v_user := SYS_CONTEXT('USERENV', 'SESSION_USER');
    -- NV, GD, Admin thấy hết
    IF v_user IN ('NV1', 'GD1', 'ADMIN') THEN
        RETURN NULL;
    -- Khách hàng chỉ thấy dòng có username của mình
    ELSE
        RETURN 'UPPER(username) = ''' || v_user || '''';
    END IF;
END;
/

-- Áp dụng Policy cho tables
BEGIN
    DBMS_RLS.ADD_POLICY(
        object_schema => 'ADMIN',
        object_name => 'CUSTOMER_INFO',
        policy_name => 'pol_cust_info',
        function_schema => 'ADMIN',
        policy_function => 'fn_auth_customer',
        statement_types => 'SELECT, UPDATE'
    );

    DBMS_RLS.ADD_POLICY(
        object_schema => 'ADMIN',
        object_name => 'ACCOUNT_BALANCE',
        policy_name => 'pol_cust_acc',
        function_schema => 'ADMIN',
        policy_function => 'fn_auth_customer',
        statement_types => 'SELECT'
    );

    DBMS_RLS.ADD_POLICY(
        object_schema => 'ADMIN',
        object_name => 'TRANSACTION_LOG',
        policy_name => 'pol_cust_trans',
        function_schema => 'ADMIN',
        policy_function => 'fn_auth_customer',
        statement_types => 'SELECT'
    );
END;
/

-- VPD2: Policy cho Nhân viên (bảo vệ cột salary)
CREATE OR REPLACE FUNCTION fn_auth_salary (
    p_schema IN VARCHAR2,
    p_object IN VARCHAR2
) RETURN VARCHAR2 AS
    v_user VARCHAR2(30);
BEGIN
    v_user := SYS_CONTEXT('USERENV', 'SESSION_USER');
    IF v_user IN ('GD1', 'ADMIN') THEN
        RETURN NULL;
    ELSE
        RETURN 'UPPER(emp_username) = ''' || v_user || '''';
    END IF;
END;
/

BEGIN
    DBMS_RLS.ADD_POLICY (
        object_schema => 'ADMIN',
        object_name => 'EMPLOYEE_INFO',
        policy_name => 'pol_emp_salary',
        function_schema => 'ADMIN',
        policy_function => 'fn_auth_salary',
        statement_types => 'SELECT',
        sec_relevant_cols => 'SALARY',
        sec_relevant_cols_opt => DBMS_RLS.ALL_ROWS
    );
END;
/

COMMIT;
