import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import {
  LayoutDashboard,
  Utensils,
  ClipboardList,
  Table,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Coffee,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const Layout = () => {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['Owner', 'Manager', 'Waiter'] },
    { name: 'Menu', href: '/menu', icon: Utensils, roles: ['Owner', 'Manager'] },
    { name: 'Orders', href: '/orders', icon: ClipboardList, roles: ['Owner', 'Manager', 'Waiter'] },
    { name: 'Tables', href: '/tables', icon: Table, roles: ['Owner', 'Manager', 'Waiter'] },
    { name: 'Reservations', href: '/reservations', icon: Calendar, roles: ['Owner', 'Manager', 'Waiter'] },
    { name: 'Staff', href: '/staff', icon: Users, roles: ['Owner', 'Manager'] },
    { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['Owner', 'Manager'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['Owner', 'Manager'] },
  ]

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user?.role || '')
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
          <Coffee className="h-8 w-8 text-amber-600" />
          <span className="text-xl font-bold text-gray-900">CafeManager</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-amber-600' : 'text-gray-500'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-amber-700">
                      {user?.fullName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
