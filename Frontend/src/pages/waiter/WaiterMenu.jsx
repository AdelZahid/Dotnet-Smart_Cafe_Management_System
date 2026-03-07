import { useEffect, useState } from 'react'
import { waiterApi } from '@/services/api'

const WaiterMenu = () => {
    const [menu, setMenu] = useState([])

    const load = async () => {
        const res = await waiterApi.getMenu()
        setMenu(res.data || [])
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Menu</h1>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {menu.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white border p-5 shadow-sm">
                        <img
                            src={item.imageUrl || 'https://via.placeholder.com/300x180?text=Menu'}
                            alt={item.name}
                            className="w-full h-40 object-cover rounded-xl border"
                        />
                        <h3 className="mt-4 text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.description || 'No description'}</p>
                        <div className="mt-3 flex items-center justify-between">
                            <span className="font-bold text-amber-700">৳ {item.unitPrice}</span>
                            <span className="text-sm text-gray-500">{item.categoryName || 'General'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WaiterMenu