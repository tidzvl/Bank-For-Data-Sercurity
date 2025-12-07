const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// API call helper
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
};

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    // Save token
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  },

  verify: async (token) => {
    return apiCall('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  }
};

// Customer API
export const customerAPI = {
  getAccounts: () => apiCall('/customer/accounts'),

  getAccount: (id) => apiCall(`/customer/accounts/${id}`),

  getTransactions: () => apiCall('/customer/transactions'),

  getProfile: () => apiCall('/customer/profile'),

  updateProfile: (data) => apiCall('/customer/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};

// Staff API
export const staffAPI = {
  getCustomers: () => apiCall('/staff/customers'),

  createCustomer: (data) => apiCall('/staff/customers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  getAccounts: () => apiCall('/staff/accounts'),

  createAccount: (data) => apiCall('/staff/accounts', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  getTransactions: () => apiCall('/staff/transactions'),

  createTransaction: (data) => apiCall('/staff/transactions', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

// Director API
export const directorAPI = {
  getPendingApprovals: () => apiCall('/director/pending-approvals'),

  approveTransaction: (id) => apiCall(`/director/approve/${id}`, {
    method: 'PUT'
  }),

  rejectTransaction: (id) => apiCall(`/director/reject/${id}`, {
    method: 'PUT'
  }),

  getEmployees: () => apiCall('/director/employees'),

  updateEmployee: (username, data) => apiCall(`/director/employees/${username}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  getCustomers: () => apiCall('/director/customers'),

  getAccounts: () => apiCall('/director/accounts'),

  lockAccount: (id) => apiCall(`/director/accounts/${id}/lock`, {
    method: 'PUT'
  }),

  unlockAccount: (id) => apiCall(`/director/accounts/${id}/unlock`, {
    method: 'PUT'
  }),

  getAuditTrail: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/director/audit-trail?${query}`);
  },

  getStats: () => apiCall('/director/stats')
};
