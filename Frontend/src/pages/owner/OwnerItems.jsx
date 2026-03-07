import { useEffect, useState } from 'react'
import { ownerApi } from '@/services/api'

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        maximumFractionDigits: 0,
    }).format(value || 0)

const ItemGroup = ({ title, items }) => (
    <div className="rounded-2xl bg-white border p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        {items?.length ? (
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="rounded-xl border p-4 flex gap-4">
                        <img
                            src={item.imageUrl || 'https://via.placeholder.com/96?text=Item'}
                            alt={item.name}
                            className="h-20 w-20 rounded-xl object-cover border"
                        />
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                                    {formatCurrency(item.unitPrice)}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">{item.description || 'No description available.'}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500">No items found in this price range.</p>
        )}
    </div>
)

const OwnerItems = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadItems = async () => {
            try {
                setLoading(true)
                const response = await ownerApi.getItemsByPriceRange()
                setData(response.data)
            } finally {
                setLoading(false)
            }
        }

        loadItems()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Items by Price Range</h1>
                <p className="text-gray-600">View all selling items grouped into high, medium, and low price sections</p>
            </div>

            {loading ? (
                <div className="text-gray-600">Loading item groups...</div>
            ) : (
                <div className="grid gap-6 xl:grid-cols-3">
                    <ItemGroup title="High Price Products" items={data?.highPriceItems || []} />
                    <ItemGroup title="Medium Price Products" items={data?.mediumPriceItems || []} />
                    <ItemGroup title="Low Price Products" items={data?.lowPriceItems || []} />
                </div>
            )}
        </div>
    )
}

export default OwnerItems