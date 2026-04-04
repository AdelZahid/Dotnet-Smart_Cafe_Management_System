import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/services/api'
import { Coffee } from 'lucide-react'

const Login = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { setAuth } = useAuthStore()

    const [mode, setMode] = useState('owner')
    const [ownerEmail, setOwnerEmail] = useState('')
    const [ownerPassword, setOwnerPassword] = useState('')
    const [employeeEmail, setEmployeeEmail] = useState('')
    const [employeeId, setEmployeeId] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const type = params.get('type')
        if (type === 'employee') setMode('employee')
        else setMode('owner')
    }, [location.search])

    const handleOwnerLogin = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            setError('')
            const response = await authApi.login({
                email: ownerEmail,
                password: ownerPassword,
            })
            setAuth(response.data.user, response.data.token)
            navigate('/owner/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Owner login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleEmployeeLogin = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            setError('')
            const response = await authApi.employeeLogin({
                email: employeeEmail,
                employeeId,
            })
            setAuth(response.data.user, response.data.token)

            if (response.data.user.role === 'Manager') {
                navigate('/manager/items')
            } else if (response.data.user.role === 'Waiter') {
                navigate('/waiter/menu')
            } else {
                navigate('/dashboard')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Employee login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
            <Link to="/" className="flex items-center space-x-2 mb-8">
                <div className="bg-amber-100 p-3 rounded-xl shadow-sm">
                    <Coffee className="h-8 w-8 text-amber-600" />
                </div>
                <span className="font-bold text-3xl tracking-tight text-gray-900">Cafems</span>
            </Link>
            <div className="w-full max-w-md rounded-2xl bg-white border shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 text-center">Login to your account</h1>

                <div className="grid grid-cols-2 gap-2 mt-6">
                    <button
                        type="button"
                        onClick={() => setMode('owner')}
                        className={`rounded-xl px-4 py-3 ${mode === 'owner' ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}
                    >
                        Owner
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('employee')}
                        className={`rounded-xl px-4 py-3 ${mode === 'employee' ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}
                    >
                        Employee
                    </button>
                </div>

                {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-red-700">{error}</div>}

                {mode === 'owner' ? (
                    <form onSubmit={handleOwnerLogin} className="mt-6 space-y-4">
                        <input
                            className="w-full rounded-xl border px-4 py-3"
                            type="email"
                            placeholder="Owner email"
                            value={ownerEmail}
                            onChange={(e) => setOwnerEmail(e.target.value)}
                            required
                        />
                        <input
                            className="w-full rounded-xl border px-4 py-3"
                            type="password"
                            placeholder="Password"
                            value={ownerPassword}
                            onChange={(e) => setOwnerPassword(e.target.value)}
                            required
                        />
                        <button className="w-full rounded-xl bg-amber-600 text-white py-3 hover:bg-amber-700" disabled={loading}>
                            {loading ? 'Signing in...' : 'Owner Sign In'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleEmployeeLogin} className="mt-6 space-y-4">
                        <input
                            className="w-full rounded-xl border px-4 py-3"
                            type="email"
                            placeholder="Employee email"
                            value={employeeEmail}
                            onChange={(e) => setEmployeeEmail(e.target.value)}
                            required
                        />
                        <input
                            className="w-full rounded-xl border px-4 py-3"
                            placeholder="Employee ID"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            required
                        />
                        <button className="w-full rounded-xl bg-amber-600 text-white py-3 hover:bg-amber-700" disabled={loading}>
                            {loading ? 'Signing in...' : 'Employee Sign In'}
                        </button>

                        <button
                            type="button"
                            className="w-full rounded-xl border py-3"
                            onClick={() => navigate('/employee/register-request')}
                        >
                            New employee? Send request
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Login