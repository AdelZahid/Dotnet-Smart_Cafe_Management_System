import { useEffect, useState } from 'react'
import { ownerApi } from '@/services/api'

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        maximumFractionDigits: 0,
    }).format(value || 0)

const OwnerEmployees = () => {
    const [employees, setEmployees] = useState([])
    const [pendingRequests, setPendingRequests] = useState([])
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [approveForm, setApproveForm] = useState({ shift: '', salary: '' })
    const [loading, setLoading] = useState(true)

    const loadData = async () => {
        try {
            setLoading(true)
            const [employeeRes, requestRes] = await Promise.all([
                ownerApi.getEmployees(),
                ownerApi.getPendingEmployeeRequests(),
            ])
            setEmployees(employeeRes.data || [])
            setPendingRequests(requestRes.data || [])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const approveRequest = async (e) => {
        e.preventDefault()
        await ownerApi.approveEmployeeRequest(selectedRequest.id, {
            shift: approveForm.shift,
            salary: Number(approveForm.salary),
        })
        setSelectedRequest(null)
        setApproveForm({ shift: '', salary: '' })
        await loadData()
    }

    const rejectRequest = async (id) => {
        const ok = window.confirm('Do you want to reject this employee request?')
        if (!ok) return
        await ownerApi.rejectEmployeeRequest(id)
        await loadData()
    }

    const deleteEmployee = async (id) => {
        const ok = window.confirm('Do you really want to remove this employee?')
        if (!ok) return
        await ownerApi.deleteEmployee(id)
        await loadData()
    }

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Employee List</h1>
                <p className="text-gray-500">Review pending employee requests and manage approved employees</p>
            </div>

            {loading ? (
                <div className="text-gray-600">Loading employee data...</div>
            ) : (
                <>
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900">Pending Employee Requests</h2>
                        {pendingRequests.length === 0 ? (
                            <div className="rounded-2xl bg-white border p-5 text-gray-500">No pending requests.</div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {pendingRequests.map((request) => (
                                    <div key={request.id} className="rounded-2xl bg-white border p-5 shadow-sm">
                                        <img
                                            src={request.imageUrl || 'https://via.placeholder.com/120?text=EMP'}
                                            alt={request.name}
                                            className="h-20 w-20 rounded-2xl object-cover border"
                                        />
                                        <h3 className="mt-4 text-lg font-semibold">{request.name}</h3>
                                        <p className="text-sm text-gray-500">{request.designation}</p>

                                        <div className="mt-4 space-y-1 text-sm text-gray-700">
                                            <p><span className="text-gray-500">Age:</span> {request.age || 'N/A'}</p>
                                            <p><span className="text-gray-500">Sex:</span> {request.sex || 'N/A'}</p>
                                            <p><span className="text-gray-500">Email:</span> {request.email}</p>
                                            <p><span className="text-gray-500">Phone:</span> {request.phone || 'N/A'}</p>
                                            <p><span className="text-gray-500">Address:</span> {request.address || 'N/A'}</p>
                                        </div>

                                        <div className="mt-5 flex gap-2">
                                            <button
                                                className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                                onClick={() => setSelectedRequest(request)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                                onClick={() => rejectRequest(request.id)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900">Approved Employees</h2>
                        {employees.length === 0 ? (
                            <div className="rounded-2xl bg-white border p-5 text-gray-500">No employees found.</div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {employees.map((employee) => (
                                    <div key={employee.id} className="rounded-2xl bg-white border p-5 shadow-sm">
                                        <img
                                            src={employee.imageUrl || 'https://via.placeholder.com/120?text=EMP'}
                                            alt={employee.name}
                                            className="h-20 w-20 rounded-2xl object-cover border"
                                        />
                                        <h3 className="mt-4 text-lg font-semibold">{employee.name}</h3>
                                        <p className="text-sm text-gray-500">{employee.designation}</p>
                                        <p className="mt-1 text-sm font-medium text-amber-700">{employee.employeeId}</p>

                                        <div className="mt-4 space-y-1 text-sm text-gray-700">
                                            <p><span className="text-gray-500">Shift:</span> {employee.shift || 'N/A'}</p>
                                            <p><span className="text-gray-500">Salary:</span> {formatCurrency(employee.salary)}</p>
                                        </div>

                                        <button
                                            className="mt-5 w-full rounded-xl bg-red-50 px-4 py-2 text-red-700 hover:bg-red-100"
                                            onClick={() => deleteEmployee(employee.id)}
                                        >
                                            Delete Employee
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}

            {selectedRequest && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white border shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-gray-900">Approve Employee</h2>
                        <p className="text-gray-500 mt-1">{selectedRequest.name}</p>

                        <form onSubmit={approveRequest} className="mt-6 space-y-4">
                            <input
                                className="w-full rounded-xl border px-4 py-3"
                                placeholder="Shift"
                                value={approveForm.shift}
                                onChange={(e) => setApproveForm({ ...approveForm, shift: e.target.value })}
                                required
                            />
                            <input
                                className="w-full rounded-xl border px-4 py-3"
                                type="number"
                                placeholder="Salary"
                                value={approveForm.salary}
                                onChange={(e) => setApproveForm({ ...approveForm, salary: e.target.value })}
                                required
                            />

                            <div className="flex gap-3">
                                <button className="flex-1 rounded-xl bg-green-600 px-4 py-3 text-white hover:bg-green-700">
                                    Proceed
                                </button>
                                <button
                                    type="button"
                                    className="flex-1 rounded-xl border px-4 py-3"
                                    onClick={() => {
                                        setSelectedRequest(null)
                                        setApproveForm({ shift: '', salary: '' })
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OwnerEmployees