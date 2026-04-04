import { useEffect, useState } from 'react'
import { managerApi } from '@/services/api'

const ManagerIngredients = () => {
    const [ingredients, setIngredients] = useState([])
    const [ingredientForm, setIngredientForm] = useState({
        name: '',
        unitOfMeasure: '',
        minStockLevel: '',
    })
    const [purchaseForm, setPurchaseForm] = useState({
        ingredientId: '',
        quantity: '',
        unitPrice: '',
        supplierName: '',
        notes: '',
        quantityUsed: '',
        quantityWasted: '',
    })

    const load = async () => {
        const res = await managerApi.getIngredients()
        setIngredients(res.data || [])
    }

    useEffect(() => {
        load()
    }, [])

    const createIngredient = async (e) => {
        e.preventDefault()
        await managerApi.createIngredient({
            name: ingredientForm.name,
            unitOfMeasure: ingredientForm.unitOfMeasure,
            minStockLevel: Number(ingredientForm.minStockLevel || 0),
        })
        setIngredientForm({ name: '', unitOfMeasure: '', minStockLevel: '' })
        await load()
    }

    const submitDailyEntry = async (e) => {
        e.preventDefault()
        
        try {
            const purchases = [];
            const quantity = Number(purchaseForm.quantity) || 0;
            if (quantity > 0) {
                purchases.push({
                    ingredientId: Number(purchaseForm.ingredientId),
                    quantity: quantity,
                    unitPrice: Number(purchaseForm.unitPrice || 0),
                    supplierName: purchaseForm.supplierName || null,
                    notes: purchaseForm.notes || null,
                });
            }

            const usages = [];
            const quantityUsed = Number(purchaseForm.quantityUsed) || 0;
            const quantityWasted = Number(purchaseForm.quantityWasted) || 0;
            if (quantityUsed > 0 || quantityWasted > 0) {
                usages.push({
                    ingredientId: Number(purchaseForm.ingredientId),
                    quantityUsed: quantityUsed,
                    quantityWasted: quantityWasted,
                    notes: purchaseForm.notes || null,
                });
            }

            if (purchases.length === 0 && usages.length === 0) {
                alert("Please enter a valid purchase or usage quantity.");
                return;
            }

            await managerApi.addDailyIngredientEntry({
                purchases: purchases,
                usages: usages,
            })

            setPurchaseForm({
                ingredientId: '',
                quantity: '',
                unitPrice: '',
                supplierName: '',
                notes: '',
                quantityUsed: '',
                quantityWasted: '',
            })
            await load()
        } catch (error) {
            console.error("Failed to add daily entry:", error)
            alert("Failed to submit entry. " + (error.response?.data?.message || ""));
        }
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Ingredients</h1>

            <div className="grid gap-6 lg:grid-cols-2">
                <form onSubmit={createIngredient} className="rounded-2xl bg-white border p-5 space-y-4">
                    <h2 className="text-xl font-semibold">Add Ingredient</h2>
                    <input className="w-full rounded-xl border px-4 py-3" placeholder="Name" value={ingredientForm.name} onChange={(e) => setIngredientForm({ ...ingredientForm, name: e.target.value })} required />
                    <input className="w-full rounded-xl border px-4 py-3" placeholder="Unit of measure (kg/liter/piece)" value={ingredientForm.unitOfMeasure} onChange={(e) => setIngredientForm({ ...ingredientForm, unitOfMeasure: e.target.value })} required />
                    <input className="w-full rounded-xl border px-4 py-3" placeholder="Minimum stock level" type="number" value={ingredientForm.minStockLevel} onChange={(e) => setIngredientForm({ ...ingredientForm, minStockLevel: e.target.value })} />
                    <button className="rounded-xl bg-amber-600 text-white px-4 py-3">Create Ingredient</button>
                </form>

                <form onSubmit={submitDailyEntry} className="rounded-2xl bg-white border p-5 space-y-4">
                    <h2 className="text-xl font-semibold">Daily Purchase / Usage Entry</h2>
                    <select className="w-full rounded-xl border px-4 py-3" value={purchaseForm.ingredientId} onChange={(e) => setPurchaseForm({ ...purchaseForm, ingredientId: e.target.value })} required>
                        <option value="">Select ingredient</option>
                        {ingredients.map((ing) => (
                            <option key={ing.id} value={ing.id}>{ing.name}</option>
                        ))}
                    </select>
                    <input className="w-full rounded-xl border px-4 py-3" placeholder="Purchased quantity" type="number" value={purchaseForm.quantity} onChange={(e) => setPurchaseForm({ ...purchaseForm, quantity: e.target.value })} />
                    <input className="w-full rounded-xl border px-4 py-3" placeholder="Purchase unit price" type="number" value={purchaseForm.unitPrice} onChange={(e) => setPurchaseForm({ ...purchaseForm, unitPrice: e.target.value })} />
                    <input className="w-full rounded-xl border px-4 py-3" placeholder="Quantity used today" type="number" value={purchaseForm.quantityUsed} onChange={(e) => setPurchaseForm({ ...purchaseForm, quantityUsed: e.target.value })} />
                    <input className="w-full rounded-xl border px-4 py-3" placeholder="Quantity wasted today" type="number" value={purchaseForm.quantityWasted} onChange={(e) => setPurchaseForm({ ...purchaseForm, quantityWasted: e.target.value })} />
                    <input className="w-full rounded-xl border px-4 py-3" placeholder="Supplier name" value={purchaseForm.supplierName} onChange={(e) => setPurchaseForm({ ...purchaseForm, supplierName: e.target.value })} />
                    <input className="w-full rounded-xl border px-4 py-3" placeholder="Notes" value={purchaseForm.notes} onChange={(e) => setPurchaseForm({ ...purchaseForm, notes: e.target.value })} />
                    <button className="rounded-xl bg-amber-600 text-white px-4 py-3">Submit Daily Entry</button>
                </form>
            </div>

            <div className="rounded-2xl bg-white border p-5">
                <h2 className="text-xl font-semibold mb-4">Ingredient Stock</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {ingredients.map((item) => (
                        <div key={item.id} className="rounded-xl border p-4">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-500">Stock: {item.currentStock} {item.unitOfMeasure}</p>
                            <p className="text-sm text-gray-500">Min: {item.minStockLevel}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ManagerIngredients