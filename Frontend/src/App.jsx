import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Menu from './pages/Menu'
import Orders from './pages/Orders'
import Reservations from './pages/Reservations'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Staff from './pages/Staff'
import Tables from './pages/Tables'

import ManagerLayout from './pages/manager/ManagerLayout'
import ManagerItems from './pages/manager/ManagerItems'
import ManagerOrders from './pages/manager/ManagerOrders'
import ManagerPurchased from './pages/manager/ManagerPurchased'
import ManagerRefundCancel from './pages/manager/ManagerRefundCancel'
import ManagerIngredients from './pages/manager/ManagerIngredients'
import ManagerAdditionalCosts from './pages/manager/ManagerAdditionalCosts'
import ManagerReservations from './pages/manager/ManagerReservations'
import ManagerSalary from './pages/manager/ManagerSalary'

import EmployeeRegisterRequest from './pages/EmployeeRegisterRequest'

import OwnerLayout from './pages/owner/OwnerLayout'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import OwnerEmployees from './pages/owner/OwnerEmployees'
import OwnerSalesReports from './pages/owner/OwnerSalesReports'
import OwnerCostReports from './pages/owner/OwnerCostReports'
import OwnerItems from './pages/owner/OwnerItems'
import OwnerManagerSalary from './pages/owner/OwnerManagerSalary'

import WaiterLayout from './pages/waiter/WaiterLayout'
import WaiterMenu from './pages/waiter/WaiterMenu'
import WaiterTables from './pages/waiter/WaiterTables'
import WaiterOrders from './pages/waiter/WaiterOrders'
import WaiterPayment from './pages/waiter/WaiterPayment'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore()
    return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/auth" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/owner/register" element={<Register />} />
            <Route path="/employee/register-request" element={<EmployeeRegisterRequest />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/menu"
                element={
                    <ProtectedRoute>
                        <Menu />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/reservations"
                element={
                    <ProtectedRoute>
                        <Reservations />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/reports"
                element={
                    <ProtectedRoute>
                        <Reports />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/staff"
                element={
                    <ProtectedRoute>
                        <Staff />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/tables"
                element={
                    <ProtectedRoute>
                        <Tables />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/owner"
                element={
                    <ProtectedRoute>
                        <OwnerLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<OwnerDashboard />} />
                <Route path="employees" element={<OwnerEmployees />} />
                <Route path="manager-salary" element={<OwnerManagerSalary />} />
                <Route path="sales" element={<OwnerSalesReports />} />
                <Route path="costs" element={<OwnerCostReports />} />
                <Route path="items" element={<OwnerItems />} />
            </Route>

            <Route
                path="/manager"
                element={
                    <ProtectedRoute>
                        <ManagerLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="items" replace />} />
                <Route path="items" element={<ManagerItems />} />
                <Route path="orders" element={<ManagerOrders />} />
                <Route path="purchased" element={<ManagerPurchased />} />
                <Route path="refund-cancel" element={<ManagerRefundCancel />} />
                <Route path="ingredients" element={<ManagerIngredients />} />
                <Route path="additional-costs" element={<ManagerAdditionalCosts />} />
                <Route path="reservations" element={<ManagerReservations />} />
                <Route path="salary" element={<ManagerSalary />} />
            </Route>

            <Route
                path="/waiter"
                element={
                    <ProtectedRoute>
                        <WaiterLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="menu" replace />} />
                <Route path="menu" element={<WaiterMenu />} />
                <Route path="tables" element={<WaiterTables />} />
                <Route path="orders" element={<WaiterOrders />} />
                <Route path="payment" element={<WaiterPayment />} />
            </Route>
        </Routes>
    )
}

export default App