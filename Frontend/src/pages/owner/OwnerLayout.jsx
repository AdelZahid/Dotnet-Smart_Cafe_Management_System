import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, BarChart3, Wallet, Package, LogOut, Coffee, HandCoins } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { label: 'Dashboard', to: '/owner/dashboard', icon: LayoutDashboard },
  { label: 'Employee List', to: '/owner/employees', icon: Users },
  { label: 'Manager Salary', to: '/owner/manager-salary', icon: HandCoins },
  { label: 'Sales Reports', to: '/owner/sales', icon: BarChart3 },
  { label: 'Cost of Production', to: '/owner/costs', icon: Wallet },
  { label: 'Items', to: '/owner/items', icon: Package },
]

const OwnerLayout = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login?type=owner')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-white border-r shadow-sm hidden md:flex md:flex-col">
        <div className="px-6 py-6 border-b">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center shadow-sm">
              <Coffee className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Cafems</h1>
              <p className="text-sm font-medium text-amber-600">{user?.cafeName || 'Owner Panel'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-amber-100 text-amber-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <div className="mb-3 rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="font-semibold text-gray-900">{user?.email || 'Owner'}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden bg-white border-b px-4 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Cafe Owner Panel</h1>
              <p className="text-xs text-gray-500">{user?.cafeName || 'Your Cafe'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              Logout
            </button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm ${
                      isActive
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              )
            })}
          </div>
        </header>

        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default OwnerLayout