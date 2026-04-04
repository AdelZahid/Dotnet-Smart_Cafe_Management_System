import { useEffect, useState } from 'react'
import { ownerApi } from '@/services/api'

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(value || 0)

const getRunningWeekRange = () => {
  const today = new Date()
  const day = today.getDay() // 0 sunday, 1 monday ...
  const diffToMonday = day === 0 ? 6 : day - 1

  const start = new Date(today)
  start.setDate(today.getDate() - diffToMonday)

  const end = new Date(today)

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  }
}

const OwnerCostReports = () => {
  const defaultRange = getRunningWeekRange()

  const [startDate, setStartDate] = useState(defaultRange.startDate)
  const [endDate, setEndDate] = useState(defaultRange.endDate)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadReport = async () => {
    try {
      setLoading(true)
      const response = await ownerApi.getCostReport(startDate, endDate)
      setReport(response.data)
    } catch (error) {
      console.error('Failed to load cost report:', error)
      alert(error.response?.data?.message || 'Failed to load cost report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReport()
  }, [])

  const applyRunningWeek = () => {
    const range = getRunningWeekRange()
    setStartDate(range.startDate)
    setEndDate(range.endDate)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-6 space-y-6">
      <div className="rounded-3xl bg-white border shadow-sm p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cost of Production</h1>
            <p className="text-gray-600 mt-2">
              View ingredient purchase entries, production cost, and weekly comparison for any selected week interval.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="date"
              className="rounded-xl border bg-white px-4 py-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <input
              type="date"
              className="rounded-xl border bg-white px-4 py-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <button
              className="rounded-xl bg-gray-900 text-white px-4 py-2 hover:bg-black"
              onClick={loadReport}
            >
              Load
            </button>

            <button
              className="rounded-xl bg-red-600 text-white px-4 py-2 hover:bg-red-700"
              onClick={() => {
                applyRunningWeek()
                setTimeout(() => {
                  loadReport()
                }, 0)
              }}
            >
              Running Week
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white border p-6 text-gray-600">
          Loading production cost report...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white border p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Cost of Production</p>
              <h3 className="mt-2 text-2xl font-bold">{formatCurrency(report?.totalCost)}</h3>
            </div>

            <div className="rounded-2xl bg-white border p-5 shadow-sm">
              <p className="text-sm text-gray-500">Most Costly Ingredient</p>
              <h3 className="mt-2 text-lg font-bold">
                {report?.mostCostlyIngredient?.ingredientName || 'N/A'}
              </h3>
            </div>

            <div className="rounded-2xl bg-white border p-5 shadow-sm">
              <p className="text-sm text-gray-500">Most Used Ingredient</p>
              <h3 className="mt-2 text-lg font-bold">
                {report?.mostUsedIngredient?.ingredientName || 'N/A'}
              </h3>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl bg-white border p-6 lg:col-span-2 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Ingredient Cost Breakdown</h2>
              <p className="text-sm text-gray-500 mb-4">
                All daily purchase entries made by the manager within the selected date interval.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="py-3">Date</th>
                      <th className="py-3">Ingredient</th>
                      <th className="py-3">Unit</th>
                      <th className="py-3">Quantity Purchased</th>
                      <th className="py-3">Unit Price</th>
                      <th className="py-3">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(report?.purchaseEntries || []).length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-6 text-center text-gray-500">
                          No purchase entries found for this date range.
                        </td>
                      </tr>
                    ) : (
                      (report?.purchaseEntries || []).map((entry, index) => (
                        <tr key={`${entry.ingredientId}-${index}-${entry.purchaseDate}`} className="border-b">
                          <td className="py-3">
                            {entry.purchaseDate
                              ? new Date(entry.purchaseDate).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td className="py-3 font-medium">{entry.ingredientName}</td>
                          <td className="py-3">{entry.unitOfMeasure}</td>
                          <td className="py-3">{entry.quantityPurchased}</td>
                          <td className="py-3">{formatCurrency(entry.unitPrice)}</td>
                          <td className="py-3">{formatCurrency(entry.totalPurchaseCost)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl bg-white border p-6 space-y-5 shadow-sm">
              <div>
                <h2 className="text-xl font-semibold mb-3">Most Costly Ingredient</h2>
                {report?.mostCostlyIngredient ? (
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Name:</span>{' '}
                      <span className="font-medium">
                        {report.mostCostlyIngredient.ingredientName}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Cost:</span>{' '}
                      <span className="font-medium">
                        {formatCurrency(report.mostCostlyIngredient.totalCost)}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">No data available.</p>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Most Used Ingredient</h2>
                {report?.mostUsedIngredient ? (
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Name:</span>{' '}
                      <span className="font-medium">
                        {report.mostUsedIngredient.ingredientName}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Quantity:</span>{' '}
                      <span className="font-medium">
                        {report.mostUsedIngredient.quantityUsed}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">No data available.</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Weekly Cost Comparison</h2>
            <div className="space-y-4">
              {(report?.weeklyCostData || []).map((week, idx) => {
                const max = Math.max(
                  ...(report?.weeklyCostData || []).map((w) => w.costAmount || 0),
                  1
                )
                const width = `${((week.costAmount || 0) / max) * 100}%`

                return (
                  <div key={`${week.weekLabel}-${idx}`} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{week.weekLabel}</span>
                      <span className="font-medium">{formatCurrency(week.costAmount)}</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-red-500" style={{ width }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default OwnerCostReports