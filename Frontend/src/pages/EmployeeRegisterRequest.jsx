import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/services/api'

const EmployeeRegisterRequest = () => {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: '',
        age: '',
        sex: '',
        email: '',
        cafeEmail: '',
        phone: '',
        address: '',
        designation: 'Waiter',
        imageUrl: '',
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const submit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            setError('')
            setMessage('')

            await authApi.employeeRegisterRequest({
                name: form.name,
                age: form.age ? Number(form.age) : null,
                sex: form.sex || null,
                email: form.email,
                cafeEmail: form.cafeEmail,
                phone: form.phone || null,
                address: form.address || null,
                designation: form.designation,
                imageUrl: form.imageUrl || null,
            })

            setMessage('Your request has been sent to the owner for approval.')

            setForm({
                name: '',
                age: '',
                sex: '',
                email: '',
                cafeEmail: '',
                phone: '',
                address: '',
                designation: 'Waiter',
                imageUrl: '',
            })
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send employee request')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-3xl rounded-3xl bg-white border shadow-lg p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Employee Request Access</h1>
                    <p className="mt-2 text-gray-500">
                        Enter your information and the cafe email. Only that owner will receive your request.
                    </p>
                </div>

                {message && (
                    <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-green-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border px-4 py-3"
                            value={form.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Age</label>
                        <input
                            type="number"
                            className="w-full rounded-xl border px-4 py-3"
                            value={form.age}
                            onChange={(e) => handleChange('age', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Sex</label>
                        <select
                            className="w-full rounded-xl border px-4 py-3"
                            value={form.sex}
                            onChange={(e) => handleChange('sex', e.target.value)}
                        >
                            <option value="">Select sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Your Email</label>
                        <input
                            type="email"
                            className="w-full rounded-xl border px-4 py-3"
                            value={form.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Cafe Email</label>
                        <input
                            type="email"
                            className="w-full rounded-xl border px-4 py-3"
                            placeholder="projectgpt057@gmail.com"
                            value={form.cafeEmail}
                            onChange={(e) => handleChange('cafeEmail', e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border px-4 py-3"
                            value={form.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Designation</label>
                        <select
                            className="w-full rounded-xl border px-4 py-3"
                            value={form.designation}
                            onChange={(e) => handleChange('designation', e.target.value)}
                            required
                        >
                            <option value="Waiter">Waiter</option>
                            <option value="Manager">Manager</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border px-4 py-3"
                            value={form.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Image URL (optional)
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-xl border px-4 py-3"
                            value={form.imageUrl}
                            onChange={(e) => handleChange('imageUrl', e.target.value)}
                        />
                    </div>

                    <div className="mt-2 flex gap-3 md:col-span-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-amber-600 px-6 py-3 font-medium text-white hover:bg-amber-700 disabled:opacity-60"
                        >
                            {loading ? 'Sending Request...' : 'Send Request'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/login?type=employee')}
                            className="rounded-xl border px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Go to Employee Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EmployeeRegisterRequest