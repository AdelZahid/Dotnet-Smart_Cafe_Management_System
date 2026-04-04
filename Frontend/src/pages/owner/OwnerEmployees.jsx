import { useEffect, useState } from 'react'
import { ownerApi } from '@/services/api'

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        maximumFractionDigits: 0,
    }).format(value || 0)

const cardImage =
    'https://via.placeholder.com/120?text=EMP'

const OwnerEmployees = () => {
    const [employees, setEmployees] = useState([])
    const [pendingRequests, setPendingRequests] = useState([])
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [selectedEmployee, setSelectedEmployee] = useState(null)
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
        if (selectedEmployee?.id === id) {
            setSelectedEmployee(null)
        }
        await loadData()
    }

    const openEmployeeView = async (employee) => {
        try {
            const detailRes = await ownerApi.getEmployeeDetail(employee.id)
            setSelectedEmployee(detailRes.data || employee)
        } catch {
            setSelectedEmployee(employee)
        }
    }

    return (
        <div className="p-6 md:p-8 space-y-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 min-h-screen">
            <div className="rounded-3xl bg-white/90 backdrop-blur border border-amber-100 shadow-sm p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Employee Management</h1>
                <p className="text-gray-500 mt-2">
                    Review pending employee requests and manage approved employees.
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
                        <p className="text-sm text-gray-500">Total Employees</p>
                        <p className="mt-2 text-3xl font-bold text-amber-700">{employees.length}</p>
                    </div>
                    <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
                        <p className="text-sm text-gray-500">Pending Requests</p>
                        <p className="mt-2 text-3xl font-bold text-blue-700">{pendingRequests.length}</p>
                    </div>
                    <div className="rounded-2xl bg-green-50 border border-green-100 p-5">
                        <p className="text-sm text-gray-500">Active Staff</p>
                        <p className="mt-2 text-3xl font-bold text-green-700">
                            {employees.filter((e) => e.isActive !== false).length}
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="rounded-2xl bg-white border p-6 text-gray-600 shadow-sm">
                    Loading employee data...
                </div>
            ) : (
                <>
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900">Pending Employee Requests</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    New job requests waiting for owner approval
                                </p>
                            </div>
                        </div>

                        {pendingRequests.length === 0 ? (
                            <div className="rounded-2xl bg-white border p-6 text-gray-500 shadow-sm">
                                No pending requests.
                            </div>
                        ) : (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {pendingRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="rounded-3xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition"
                                    >
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={request.imageUrl || cardImage}
                                                alt={request.name}
                                                className="h-20 w-20 rounded-2xl object-cover border"
                                            />
                                            <div className="min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {request.name}
                                                </h3>
                                                <p className="text-sm font-medium text-amber-700">{request.designation}</p>
                                                <span className="inline-flex mt-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                                                    Pending
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-5 space-y-2 text-sm text-gray-700">
                                            <p><span className="text-gray-500">Age:</span> {request.age || 'N/A'}</p>
                                            <p><span className="text-gray-500">Sex:</span> {request.sex || 'N/A'}</p>
                                            <p className="break-all"><span className="text-gray-500">Email:</span> {request.email}</p>
                                            <p><span className="text-gray-500">Phone:</span> {request.phone || 'N/A'}</p>
                                            <p><span className="text-gray-500">Address:</span> {request.address || 'N/A'}</p>
                                            {request.cafeEmail && (
                                                <p className="break-all">
                                                    <span className="text-gray-500">Cafe Email:</span> {request.cafeEmail}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-5 flex gap-2">
                                            <button
                                                className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-white hover:bg-green-700"
                                                onClick={() => setSelectedRequest(request)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-white hover:bg-red-700"
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
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Approved Employees</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Active employees currently working in the cafe
                            </p>
                        </div>

                        {employees.length === 0 ? (
                            <div className="rounded-2xl bg-white border p-6 text-gray-500 shadow-sm">
                                No employees found.
                            </div>
                        ) : (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {employees.map((employee) => (
                                    <div
                                        key={employee.id}
                                        className="rounded-3xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition"
                                    >
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={employee.imageUrl || cardImage}
                                                alt={employee.name}
                                                className="h-20 w-20 rounded-2xl object-cover border"
                                            />
                                            <div className="min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {employee.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">{employee.designation}</p>
                                                <p className="mt-1 text-sm font-medium text-amber-700">
                                                    {employee.employeeId}
                                                </p>
                                                <span
                                                    className={`inline-flex mt-2 rounded-full px-3 py-1 text-xs font-medium ${employee.isActive !== false
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {employee.isActive !== false ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-5 space-y-2 text-sm text-gray-700">
                                            <p><span className="text-gray-500">Shift:</span> {employee.shift || 'N/A'}</p>
                                            <p><span className="text-gray-500">Salary:</span> {formatCurrency(employee.salary)}</p>
                                            <p>
                                                <span className="text-gray-500">Joining Date:</span>{' '}
                                                {employee.joiningDate
                                                    ? new Date(employee.joiningDate).toLocaleDateString()
                                                    : 'N/A'}
                                            </p>
                                        </div>

                                        <div className="mt-5 flex gap-2">
                                            <button
                                                className="flex-1 rounded-xl bg-gray-900 px-4 py-2.5 text-white hover:bg-black"
                                                onClick={() => openEmployeeView(employee)}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="flex-1 rounded-xl bg-red-50 px-4 py-2.5 text-red-700 hover:bg-red-100"
                                                onClick={() => deleteEmployee(employee.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}

            {selectedRequest && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white border shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-gray-900">Approve Employee</h2>
                        <p className="text-gray-500 mt-1">
                            Set shift and salary for <span className="font-medium">{selectedRequest.name}</span>
                        </p>

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

            {selectedEmployee && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-3xl rounded-3xl bg-white border shadow-xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={selectedEmployee.imageUrl || cardImage}
                                    alt={selectedEmployee.name}
                                    className="h-24 w-24 rounded-3xl object-cover border"
                                />
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {selectedEmployee.name}
                                    </h2>
                                    <p className="text-gray-500">{selectedEmployee.designation}</p>
                                    <p className="mt-1 text-sm font-medium text-amber-700">
                                        {selectedEmployee.employeeId || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <button
                                className="rounded-xl border px-4 py-2 hover:bg-gray-50"
                                onClick={() => setSelectedEmployee(null)}
                            >
                                Close
                            </button>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="rounded-2xl bg-gray-50 p-5 border">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p><span className="text-gray-500">Name:</span> {selectedEmployee.name || 'N/A'}</p>
                                    <p><span className="text-gray-500">Employee ID:</span> {selectedEmployee.employeeId || 'N/A'}</p>
                                    <p><span className="text-gray-500">Designation:</span> {selectedEmployee.designation || 'N/A'}</p>
                                    <p><span className="text-gray-500">Shift:</span> {selectedEmployee.shift || 'N/A'}</p>
                                    <p><span className="text-gray-500">Salary:</span> {formatCurrency(selectedEmployee.salary)}</p>
                                    <p>
                                        <span className="text-gray-500">Status:</span>{' '}
                                        {selectedEmployee.isActive !== false ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-gray-50 p-5 border">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p><span className="text-gray-500">Email:</span> {selectedEmployee.email || 'N/A'}</p>
                                    <p><span className="text-gray-500">Phone:</span> {selectedEmployee.phone || 'N/A'}</p>
                                    <p><span className="text-gray-500">Address:</span> {selectedEmployee.address || 'N/A'}</p>
                                    <p><span className="text-gray-500">Age:</span> {selectedEmployee.age || 'N/A'}</p>
                                    <p><span className="text-gray-500">Sex:</span> {selectedEmployee.sex || 'N/A'}</p>
                                    <p>
                                        <span className="text-gray-500">Joining Date:</span>{' '}
                                        {selectedEmployee.joiningDate
                                            ? new Date(selectedEmployee.joiningDate).toLocaleDateString()
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
                                <p className="text-sm text-gray-500">Absent Days This Month</p>
                                <p className="mt-2 text-3xl font-bold text-blue-700">
                                    {selectedEmployee.absentDaysCount ?? 0}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-green-50 border border-green-100 p-5">
                                <p className="text-sm text-gray-500">Orders Taken This Month</p>
                                <p className="mt-2 text-3xl font-bold text-green-700">
                                    {selectedEmployee.ordersTakenThisMonth ?? 0}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
                                <p className="text-sm text-gray-500">Last Month Salary</p>
                                <p className="mt-2 text-lg font-bold text-amber-700">
                                    {selectedEmployee.lastMonthSalary
                                        ? selectedEmployee.lastMonthSalary.isPaid
                                            ? 'Paid'
                                            : 'Due'
                                        : 'No Record'}
                                </p>
                            </div>
                        </div>

                        {selectedEmployee.attendanceThisMonth?.length > 0 && (
                            <div className="mt-6 rounded-2xl bg-white border p-5">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance This Month</h3>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {selectedEmployee.attendanceThisMonth.map((attendance, index) => (
                                        <div
                                            key={index}
                                            className="rounded-xl border p-3 flex items-center justify-between"
                                        >
                                            <span className="text-sm text-gray-700">
                                                {attendance.date
                                                    ? new Date(attendance.date).toLocaleDateString()
                                                    : 'N/A'}
                                            </span>
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${attendance.status === 'Absent'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-green-100 text-green-700'
                                                    }`}
                                            >
                                                {attendance.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                className="rounded-xl bg-gray-900 px-5 py-3 text-white hover:bg-black"
                                onClick={() => setSelectedEmployee(null)}
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OwnerEmployees