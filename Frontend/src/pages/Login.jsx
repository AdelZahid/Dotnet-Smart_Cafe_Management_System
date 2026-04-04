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
    const [success, setSuccess] = useState('')

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const type = params.get('type')
        if (type === 'employee') setMode('employee')
        else setMode('owner')
    }, [location.search])

    // ---------- VALIDATION ----------
    const validateOwner = () => {
        if (!ownerEmail || !ownerPassword) {
            setError('All owner fields are required')
            return false
        }
        if (!ownerEmail.includes('@')) {
            setError('Enter a valid email')
            return false
        }
        return true
    }

    const validateEmployee = () => {
        if (!employeeEmail || !employeeId) {
            setError('All employee fields are required')
            return false
        }
        return true
    }

    // ---------- OWNER LOGIN ----------
    const handleOwnerLogin = async (e) => {
        e.preventDefault()
        if (!validateOwner()) return

        try {
            setLoading(true)
            setError('')
            setSuccess('')

            const response = await authApi.login({
                email: ownerEmail,
                password: ownerPassword,
            })

            setAuth(response.data.user, response.data.token)
            setSuccess('Login successful! Redirecting...')

            setTimeout(() => navigate('/owner/dashboard'), 500)
        } catch (err) {
            setError(err.response?.data?.message || 'Owner login failed')
        } finally {
            setLoading(false)
        }
    }

    // ---------- EMPLOYEE LOGIN ----------
    const handleEmployeeLogin = async (e) => {
        e.preventDefault()
        if (!validateEmployee()) return

        try {
            setLoading(true)
            setError('')
            setSuccess('')

            const response = await authApi.employeeLogin({
                email: employeeEmail,
                employeeId,
            })

            setAuth(response.data.user, response.data.token)
            setSuccess('Login successful! Redirecting...')

            const role = response.data.user.role

            setTimeout(() => {
                if (role === 'Manager') navigate('/manager/items')
                else if (role === 'Waiter') navigate('/waiter/menu')
                else navigate('/dashboard')
            }, 500)
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
                <h1 className="text-2xl font-bold text-center">Login to your account</h1>

                {/* Switch */}
                <div className="grid grid-cols-2 gap-2 mt-6">
                    <button onClick={() => { setMode('owner'); setError('') }}
                        className={`rounded-xl px-4 py-3 ${mode === 'owner' ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>
                        Owner
                    </button>
                    <button onClick={() => { setMode('employee'); setError('') }}
                        className={`rounded-xl px-4 py-3 ${mode === 'employee' ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>
                        Employee
                    </button>
                </div>

                {error && <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-xl">{error}</div>}
                {success && <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-xl">{success}</div>}

                {mode === 'owner' ? (
                    <form onSubmit={handleOwnerLogin} className="mt-6 space-y-4">
                        <input className="w-full border px-4 py-3 rounded-xl"
                            type="email" placeholder="Owner email"
                            value={ownerEmail}
                            onChange={(e) => setOwnerEmail(e.target.value)} required />

                        <input className="w-full border px-4 py-3 rounded-xl"
                            type="password" placeholder="Password"
                            value={ownerPassword}
                            onChange={(e) => setOwnerPassword(e.target.value)} required />

                        <button className="w-full bg-amber-600 text-white py-3 rounded-xl"
                            disabled={loading}>
                            {loading ? 'Signing in...' : 'Owner Sign In'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleEmployeeLogin} className="mt-6 space-y-4">
                        <input className="w-full border px-4 py-3 rounded-xl"
                            type="email" placeholder="Employee email"
                            value={employeeEmail}
                            onChange={(e) => setEmployeeEmail(e.target.value)} required />

                        <input className="w-full border px-4 py-3 rounded-xl"
                            placeholder="Employee ID"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)} required />

                        <button className="w-full bg-amber-600 text-white py-3 rounded-xl"
                            disabled={loading}>
                            {loading ? 'Signing in...' : 'Employee Sign In'}
                        </button>

                        <button type="button"
                            onClick={() => navigate('/employee/register-request')}
                            className="w-full border py-3 rounded-xl">
                            New employee? Send request
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Login