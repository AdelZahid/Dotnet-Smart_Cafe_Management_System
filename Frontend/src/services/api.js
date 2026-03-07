import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5093/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  employeeLogin: (data) => api.post('/auth/employee-login', data),
  register: (data) => api.post('/auth/register', data),
  registerOwner: (data) => api.post('/auth/register-owner', data),
  registerEmployee: (data) => api.post('/auth/register-employee', data),
  employeeRegisterRequest: (data) => api.post('/auth/employee-register-request', data),
}




// Users
export const userApi = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
}

// Categories
export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
}

// Menu Items
export const menuItemApi = {
  getAll: () => api.get('/menuitems'),
  getById: (id) => api.get(`/menuitems/${id}`),
  getByCategory: (categoryId) => api.get(`/menuitems/category/${categoryId}`),
  create: (data) => api.post('/menuitems', data),
  update: (id, data) => api.put(`/menuitems/${id}`, data),
  delete: (id) => api.delete(`/menuitems/${id}`),
}

// Tables
export const tableApi = {
  getAll: () => api.get('/tables'),
  getById: (id) => api.get(`/tables/${id}`),
  create: (data) => api.post('/tables', data),
  update: (id, data) => api.put(`/tables/${id}`, data),
  delete: (id) => api.delete(`/tables/${id}`),
}

// Reservations
export const reservationApi = {
  getAll: () => api.get('/reservations'),
  getById: (id) => api.get(`/reservations/${id}`),
  getByDate: (date) => api.get(`/reservations/date/${date}`),
  create: (data) => api.post('/reservations', data),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  delete: (id) => api.delete(`/reservations/${id}`),
}

// Orders
export const orderApi = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getActive: () => api.get('/orders/active'),
  getByTable: (tableId) => api.get(`/orders/table/${tableId}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  addItem: (orderId, item) => api.post(`/orders/${orderId}/items`, item),
  removeItem: (orderId, itemId) => api.delete(`/orders/${orderId}/items/${itemId}`),
  complete: (id) => api.post(`/orders/${id}/complete`),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
}

// Reports
export const reportApi = {
  getDashboardStats: () => api.get('/reports/dashboard'),
  getSalesReport: (startDate, endDate) => 
    api.get(`/reports/sales?startDate=${startDate}&endDate=${endDate}`),
}

//OwnerCostreports
export const ownerApi = {
    getDashboard: (startDate, endDate) =>
        api.get(`/owner/dashboard?startDate=${startDate}&endDate=${endDate}`),
    getPendingEmployeeRequests: () => api.get('/owner/employee-requests'),
    approveEmployeeRequest: (id, data) => api.post(`/owner/employee-requests/${id}/approve`, data),
    rejectEmployeeRequest: (id) => api.post(`/owner/employee-requests/${id}/reject`),

    getEmployees: () => api.get('/owner/employees'),

    getEmployeeDetail: (id) => api.get(`/owner/employees/${id}`),

    deleteEmployee: (id) => api.delete(`/owner/employees/${id}`),

    createEmployee: (data) => api.post('/owner/employees', data),

    employeeLogin: (data) => api.post('/auth/employee-login', data),

    approveEmployee: (id, employeeCode) =>
        api.post(`/owner/employees/${id}/approve`, { employeeCode }),

    getSalesReport: (startDate, endDate) =>
        api.get(`/owner/sales-report?startDate=${startDate}&endDate=${endDate}`),

    getCostReport: (startDate, endDate) =>
        api.get(`/owner/cost-report?startDate=${startDate}&endDate=${endDate}`),

    getItemsByPriceRange: () => api.get('/owner/items'),
}

export const managerApi = {
    getItems: () => api.get('/manager/items'),
    createItem: (data) => api.post('/manager/items', data),
    updateItem: (id, data) => api.put(`/manager/items/${id}`, data),

    getCurrentOrders: () => api.get('/manager/orders/current'),
    getOnlineOrders: () => api.get('/manager/orders/online'),
    updateOrderStatus: (id, status) => api.put(`/manager/orders/${id}/status`, { status }),

    getPurchasedOrders: (startDate, endDate) =>
        api.get(`/manager/orders/purchased?startDate=${startDate}&endDate=${endDate}`),

    getRefundCancelOrders: (startDate, endDate) =>
        api.get(`/manager/orders/refund-cancel?startDate=${startDate}&endDate=${endDate}`),

    processRefund: (id, refundAmount, reason) =>
        api.post(`/manager/orders/${id}/refund`, { refundAmount, reason }),

    getIngredients: () => api.get('/manager/ingredients'),
    createIngredient: (data) => api.post('/manager/ingredients', data),
    addDailyIngredientEntry: (data) => api.post('/manager/ingredients/daily-entry', data),

    getAdditionalCosts: (startDate, endDate) =>
        api.get(`/manager/additional-costs?startDate=${startDate}&endDate=${endDate}`),
    createAdditionalCost: (data) => api.post('/manager/additional-costs', data),

    getReservations: (date) => api.get(`/manager/reservations${date ? `?date=${date}` : ''}`),
    getTodayReservations: () => api.get('/manager/reservations/today'),
    createReservation: (data) => api.post('/manager/reservations', data),
    cancelReservation: (id) => api.put(`/manager/reservations/${id}/cancel`),

    getSalary: (month, year) => api.get(`/manager/salary?month=${month}&year=${year}`),
    processSalary: (data) => api.post('/manager/salary', data),
}


export const waiterApi = {
    getMenu: () => api.get('/waiter/menu'),
    getMyOrders: () => api.get('/waiter/orders'),
    createOrder: (data) => api.post('/waiter/orders', data),
    updateOrderStatus: (id, status) => api.put(`/waiter/orders/${id}/status`, { status }),
    getServedOrdersForPayment: () => api.get('/waiter/payments/served-orders'),
    processPayment: (data) => api.post('/waiter/payments', data),
    processRefund: (id, reason) => api.post(`/waiter/orders/${id}/refund`, { reason }),
}

export default api
