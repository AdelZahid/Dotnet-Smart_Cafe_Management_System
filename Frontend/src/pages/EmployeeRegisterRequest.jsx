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

            setMessage(
                'Your request has been sent to the owner for approval.'
            )

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
            setError(
                err.response?.data?.message ||
                    'Failed to send employee request'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-3xl bg-white border shadow-lg rounded-3xl p-8">

                <h1 className="text-3xl font-bold mb-4">
                    Employee Request Access
                </h1>

                {message && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-xl mb-4">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-4">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={submit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <input
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) =>
                            handleChange('name', e.target.value)
                        }
                        required
                    />

                    <input
                        placeholder="Age"
                        type="number"
                        value={form.age}
                        onChange={(e) =>
                            handleChange('age', e.target.value)
                        }
                    />

                    <select
                        value={form.sex}
                        onChange={(e) =>
                            handleChange('sex', e.target.value)
                        }
                    >
                        <option value="">Sex</option>
                        <option>Male</option>
                        <option>Female</option>
                    </select>

                    <input
                        type="email"
                        placeholder="Your Email"
                        value={form.email}
                        onChange={(e) =>
                            handleChange('email', e.target.value)
                        }
                        required
                    />

                    <input
                        type="email"
                        placeholder="Cafe Email"
                        value={form.cafeEmail}
                        onChange={(e) =>
                            handleChange('cafeEmail', e.target.value)
                        }
                        required
                    />

                    <input
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) =>
                            handleChange('phone', e.target.value)
                        }
                    />

                    <input
                        placeholder="Address"
                        value={form.address}
                        onChange={(e) =>
                            handleChange('address', e.target.value)
                        }
                    />

                    <select
                        value={form.designation}
                        onChange={(e) =>
                            handleChange('designation', e.target.value)
                        }
                    >
                        <option>Waiter</option>
                        <option>Manager</option>
                    </select>

                    <input
                        placeholder="Image URL"
                        value={form.imageUrl}
                        onChange={(e) =>
                            handleChange('imageUrl', e.target.value)
                        }
                    />

                    <div className="md:col-span-2 flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-amber-600 text-white px-6 py-3 rounded-xl"
                        >
                            {loading ? 'Sending...' : 'Send Request'}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate('/login?type=employee')
                            }
                            className="border px-6 py-3 rounded-xl"
                        >
                            Go to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EmployeeRegisterRequest