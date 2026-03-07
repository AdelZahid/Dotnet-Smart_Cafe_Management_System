import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BookOpen, ClipboardList, CreditCard, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const items = [
    { to: '/waiter/menu', label: 'Menu', icon: BookOpen },
    { to: '/waiter/orders', label: 'Orders', icon: ClipboardList },
    { to: '/waiter/payment', label: 'Payment', icon: CreditCard },
]

const WaiterLayout = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        navigate('/login?type=employee')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside className="w-72 bg-white border-r shadow-sm hidden md:flex md:flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-900">Waiter Panel</h1>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {items.map((item) => {
                        const Icon = item.icon
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-100 text-gray-700'
                                    }`
                                }
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </NavLink>
                        )
                    })}
                </nav>

                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full rounded-xl bg-red-50 text-red-700 py-3 hover:bg-red-100"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <LogOut className="h-4 w-4" />
                            Logout
                        </div>
                    </button>
                </div>
            </aside>

            <div className="flex-1">
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default WaiterLayout