import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { menuItemApi, categoryApi } from '@/services/api'
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
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unitPrice: '',
    categoryId: '',
    isAvailable: true,
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: ['menu-items'],
    queryFn: () => menuItemApi.getAll().then((res) => res.data),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then((res) => res.data),
  })

  const createMutation = useMutation({
    mutationFn: (data) => menuItemApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] })
      setIsAddDialogOpen(false)
      resetForm()
      toast({ title: 'Menu item created successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to create menu item', variant: 'destructive' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => menuItemApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] })
      setEditingItem(null)
      resetForm()
      toast({ title: 'Menu item updated successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to update menu item', variant: 'destructive' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => menuItemApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] })
      toast({ title: 'Menu item deleted successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to delete menu item', variant: 'destructive' })
    },
  })

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      isAvailable: true,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      unitPrice: parseFloat(formData.unitPrice),
      categoryId: parseInt(formData.categoryId),
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      unitPrice: item.unitPrice.toString(),
      categoryId: item.categoryId.toString(),
      isAvailable: item.isAvailable,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteMutation.mutate(id)
    }
  }

  const filteredItems = menuItems?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const itemsByCategory = (categoryId) =>
    filteredItems?.filter((item) => item.categoryId === categoryId) || []

  if (menuLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-500">Manage your cafe menu items</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isAvailable">Available</Label>
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue={categories?.[0]?.id.toString()}>
        <TabsList className="flex-wrap">
          {categories?.map((category) => (
            <TabsTrigger key={category.id} value={category.id.toString()}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories?.map((category) => (
          <TabsContent key={category.id} value={category.id.toString()}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {itemsByCategory(category.id).map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        <p className="text-lg font-bold text-amber-600 mt-2">
                          {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <Badge
                      variant={item.isAvailable ? 'default' : 'secondary'}
                      className="mt-3"
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default Menu
