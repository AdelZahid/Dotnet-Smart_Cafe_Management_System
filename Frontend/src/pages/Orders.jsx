import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi, tableApi, menuItemApi } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const Orders = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [orderType, setOrderType] = useState('DineIn')
  const [selectedTable, setSelectedTable] = useState('')
  const [orderItems, setOrderItems] = useState([])
  const [selectedMenuItem, setSelectedMenuItem] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [itemNotes, setItemNotes] = useState('')

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderApi.getAll().then((res) => res.data),
  })

  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: () => tableApi.getAll().then((res) => res.data),
  })

  const { data: menuItems } = useQuery({
    queryKey: ['menu-items'],
    queryFn: () => menuItemApi.getAll().then((res) => res.data),
  })

  const createMutation = useMutation({
    mutationFn: (data) => orderApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      setIsAddDialogOpen(false)
      resetForm()
      toast({ title: 'Order created successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to create order', variant: 'destructive' })
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => orderApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast({ title: 'Order status updated' })
    },
  })

  const completeMutation = useMutation({
    mutationFn: (id) => orderApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      toast({ title: 'Order completed' })
    },
  })

  const resetForm = () => {
    setOrderType('DineIn')
    setSelectedTable('')
    setOrderItems([])
    setSelectedMenuItem('')
    setQuantity('1')
    setItemNotes('')
  }

  const addItemToOrder = () => {
    if (!selectedMenuItem || parseInt(quantity) < 1) return
    setOrderItems([
      ...orderItems,
      {
        menuItemId: parseInt(selectedMenuItem),
        quantity: parseInt(quantity),
        notes: itemNotes,
      },
    ])
    setSelectedMenuItem('')
    setQuantity('1')
    setItemNotes('')
  }

  const removeItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (orderItems.length === 0) {
      toast({ title: 'Please add at least one item', variant: 'destructive' })
      return
    }

    const data = {
      orderType,
      items: orderItems,
    }

    if (orderType === 'DineIn' && selectedTable) {
      data.tableId = parseInt(selectedTable)
    }

    createMutation.mutate(data)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Preparing':
        return 'bg-blue-100 text-blue-800'
      case 'Ready':
        return 'bg-green-100 text-green-800'
      case 'Served':
        return 'bg-purple-100 text-purple-800'
      case 'Paid':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const activeOrders = orders?.filter((o) => o.status !== 'Paid' && o.status !== 'Cancelled') || []
  const completedOrders = orders?.filter((o) => o.status === 'Paid') || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  const OrderCard = ({ order }) => (
    <Card key={order.id}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Order #{order.id}</h3>
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {order.table ? `Table ${order.table.tableNumber}` : order.orderType} • {' '}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
            <div className="mt-2 space-y-1">
              {order.orderItems.map((item, idx) => (
                <p key={idx} className="text-sm">
                  {item.quantity}x {item.menuItem?.name}
                </p>
              ))}
            </div>
            <p className="text-lg font-bold text-amber-600 mt-2">
              {formatCurrency(order.totalAmount)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {order.status === 'Pending' && (
              <Button
                size="sm"
                onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'Preparing' })}
              >
                Start
              </Button>
            )}
            {order.status === 'Preparing' && (
              <Button
                size="sm"
                onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'Ready' })}
              >
                Ready
              </Button>
            )}
            {order.status === 'Ready' && (
              <Button
                size="sm"
                onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'Served' })}
              >
                Serve
              </Button>
            )}
            {order.status === 'Served' && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => completeMutation.mutate(order.id)}
              >
                Complete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">Manage customer orders</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Order Type</Label>
                <Select
                  value={orderType}
                  onValueChange={(value) => setOrderType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DineIn">Dine In</SelectItem>
                    <SelectItem value="Takeaway">Takeaway</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {orderType === 'DineIn' && (
                <div className="space-y-2">
                  <Label>Table</Label>
                  <Select value={selectedTable} onValueChange={setSelectedTable}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select table" />
                    </SelectTrigger>
                    <SelectContent>
                      {tables
                        ?.filter((t) => t.status === 'Available')
                        .map((table) => (
                          <SelectItem key={table.id} value={table.id.toString()}>
                            Table {table.tableNumber} (Capacity: {table.capacity})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Add Items</h4>
                <div className="grid grid-cols-4 gap-2">
                  <Select value={selectedMenuItem} onValueChange={setSelectedMenuItem}>
                    <SelectTrigger>
                      <SelectValue placeholder="Item" />
                    </SelectTrigger>
                    <SelectContent>
                      {menuItems?.filter((i) => i.isAvailable).map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name} - {formatCurrency(item.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Qty"
                  />
                  <Input
                    value={itemNotes}
                    onChange={(e) => setItemNotes(e.target.value)}
                    placeholder="Notes"
                  />
                  <Button type="button" onClick={addItemToOrder}>
                    Add
                  </Button>
                </div>

                {orderItems.length > 0 && (
                  <div className="space-y-2">
                    {orderItems.map((item, idx) => {
                      const menuItem = menuItems?.find((m) => m.id === item.menuItemId)
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span>
                            {item.quantity}x {menuItem?.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(idx)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                Create Order
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
            {activeOrders.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-8">No active orders</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
            {completedOrders.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-8">No completed orders</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Orders
