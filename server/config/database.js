import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

// Oracle client initialization
try {
  // For Windows, you may need to set the Oracle Instant Client path
  // Uncomment and modify this if needed:
  // oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_19_8' });

  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
  oracledb.autoCommit = true;
} catch (err) {
  console.error('Error initializing Oracle Client:', err);
}

// Database configuration
const dbConfig = {
  user: process.env.ORACLE_USER || 'system',
  password: process.env.ORACLE_PASSWORD || 'Oracle123',
  connectString: process.env.ORACLE_CONNECT_STRING || 'localhost:1521/XE'
};

const bankingDbConfig = {
  user: process.env.BANKING_ADMIN_USER || 'admin',
  password: process.env.BANKING_ADMIN_PASSWORD || '123456',
  connectString: process.env.BANKING_CONNECT_STRING || 'localhost:1521/banking'
};

// Get connection to system database
export async function getSystemConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    return connection;
  } catch (err) {
    console.error('Error connecting to Oracle:', err);
    throw err;
  }
}

// Get connection to banking PDB
export async function getBankingConnection() {
  try {
    const connection = await oracledb.getConnection(bankingDbConfig);
    return connection;
  } catch (err) {
    console.error('Error connecting to Banking PDB:', err);
    throw err;
  }
}

// Get connection as specific user (for authentication)
export async function getUserConnection(username, password) {
  try {
    const connection = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: process.env.BANKING_CONNECT_STRING || 'localhost:1521/banking'
    });
    return connection;
  } catch (err) {
    if (err.message.includes('ORA-01017')) {
      throw new Error('Invalid username or password');
    } else if (err.message.includes('ORA-28000')) {
      throw new Error('Account is locked. Please contact administrator.');
    }
    throw err;
  }
}

// Close connection
export async function closeConnection(connection) {
  try {
    if (connection) {
      await connection.close();
    }
  } catch (err) {
    console.error('Error closing connection:', err);
  }
}

// Execute query helper
export async function executeQuery(connection, sql, binds = [], options = {}) {
  try {
    const result = await connection.execute(sql, binds, options);
    return result;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  }
}

export default {
  getSystemConnection,
  getBankingConnection,
  getUserConnection,
  closeConnection,
  executeQuery
};
