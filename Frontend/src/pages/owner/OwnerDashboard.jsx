import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, TrendingUp, Wallet, Receipt, Users, AlertTriangle, BarChart3 } from 'lucide-react'
import { ownerApi } from '@/services/api'

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        maximumFractionDigits: 0,
    }).format(value || 0)

const getDateRangeFromPeriod = (period) => {
    const today = new Date()
    const endDate = today.toISOString().split('T')[0]
    const start = new Date(today)

    if (period === 'week') start.setDate(today.getDate() - 7)
    else if (period === 'month') start.setMonth(today.getMonth() - 1)
    else if (period === 'year') start.setFullYear(today.getFullYear() - 1)
    else start.setMonth(today.getMonth() - 1)

    return {
        startDate: start.toISOString().split('T')[0],
        endDate,
    }
}

const StatCard = ({ title, value, icon: Icon, accent }) => (
    <div className="rounded-2xl bg-white p-5 shadow-sm border">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`rounded-xl p-3 ${accent}`}>
                <Icon className="h-5 w-5" />
            </div>
        </div>
    </div>
)

const SimpleBarChart = ({ data, valueKey, labelKey = 'weekLabel' }) => {
    const max = Math.max(...data.map((d) => d[valueKey] || 0), 1)

    return (
        <div className="space-y-4">
            {data.map((item, index) => {
                const value = item[valueKey] || 0
                const width = `${(value / max) * 100}%`
                return (
                    <div key={`${item[labelKey]}-${index}`} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{item[labelKey]}</span>
                            <span className="font-medium text-gray-900">{formatCurrency(value)}</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full rounded-full bg-amber-500" style={{ width }} />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const OwnerDashboard = () => {
    const [period, setPeriod] = useState('month')
    const [dashboard, setDashboard] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const dateRange = useMemo(() => getDateRangeFromPeriod(period), [period])

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true)
                setError('')
                const response = await ownerApi.getDashboard(dateRange.startDate, dateRange.endDate)
                setDashboard(response.data)
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load dashboard')
            } finally {
                setLoading(false)
            }
        }

        loadDashboard()
    }, [dateRange.startDate, dateRange.endDate])

    if (loading) {
        return <div className="p-6 text-gray-600">Loading owner dashboard...</div>
    }

    if (error) {
        return <div className="p-6 text-red-600">{error}</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
                    <p className="text-gray-600">Home page overview for your cafe business</p>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white border px-4 py-2">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <select
                        className="bg-transparent outline-none"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <option value="week">Last 7 Days</option>
                        <option value="month">Running Month</option>
                        <option value="year">Running Year</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <StatCard
                    title="Total Sales"
                    value={formatCurrency(dashboard?.totalSales)}
                    icon={TrendingUp}
                    accent="bg-green-100 text-green-700"
                />
                <StatCard
                    title="Production Cost"
                    value={formatCurrency(dashboard?.totalCostOfProduction)}
                    icon={Wallet}
                    accent="bg-red-100 text-red-700"
                />
                <StatCard
                    title="Bills & Utilities"
                    value={formatCurrency(dashboard?.totalBills)}
                    icon={Receipt}
                    accent="bg-blue-100 text-blue-700"
                />
                <StatCard
                    title="Employee Salary"
                    value={formatCurrency(dashboard?.totalEmployeeSalary)}
                    icon={Users}
                    accent="bg-purple-100 text-purple-700"
                />
                <StatCard
                    title="Irregular Cost"
                    value={formatCurrency(dashboard?.irregularCosts)}
                    icon={AlertTriangle}
                    accent="bg-orange-100 text-orange-700"
                />
                <StatCard
                    title="Profit / Loss"
                    value={formatCurrency(dashboard?.totalProfitOrLoss)}
                    icon={BarChart3}
                    accent="bg-amber-100 text-amber-700"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl bg-white border shadow-sm p-6 lg:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Income Comparison</h2>
                    {dashboard?.weeklyIncomeData?.length ? (
                        <SimpleBarChart data={dashboard.weeklyIncomeData} valueKey="income" />
                    ) : (
                        <p className="text-gray-500">No income data available.</p>
                    )}
                </div>

                <div className="rounded-2xl bg-white border shadow-sm p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Quick Summary</h2>
                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">Total Income</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboard?.totalIncome)}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">Selected Period</p>
                        <p className="text-lg font-semibold text-gray-900 capitalize">{period}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">Date Range</p>
                        <p className="text-sm font-medium text-gray-900">
                            {dateRange.startDate} to {dateRange.endDate}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerDashboard