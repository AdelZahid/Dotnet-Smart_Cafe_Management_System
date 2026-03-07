import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryApi } from '@/services/api'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const Settings = () => {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then((res) => res.data),
  })

  const createCategoryMutation = useMutation({
    mutationFn: (data) => categoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsAddCategoryOpen(false)
      resetCategoryForm()
      toast({ title: 'Category created successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to create category', variant: 'destructive' })
    },
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => categoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setEditingCategory(null)
      resetCategoryForm()
      toast({ title: 'Category updated successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to update category', variant: 'destructive' })
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => categoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({ title: 'Category deleted successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to delete category', variant: 'destructive' })
    },
  })

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', description: '' })
  }

  const handleCategorySubmit = (e) => {
    e.preventDefault()
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data: categoryForm })
    } else {
      createCategoryMutation.mutate(categoryForm)
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setCategoryForm({ name: category.name, description: category.description || '' })
    setIsAddCategoryOpen(true)
  }

  const handleDeleteCategory = (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategoryMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage system settings</p>
      </div>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Menu Categories</h2>
            <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                    {editingCategory ? 'Update' : 'Create'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories?.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Tag className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        {category.description && (
                          <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {category.menuItems?.length || 0} items
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {categories?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No categories found. Add your first category.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">About Cafe Management System</h3>
                <p className="text-sm text-gray-600">
                  A comprehensive solution for managing your cafe operations including menu management,
                  order processing, table reservations, staff management, and sales reporting.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Version</h3>
                <p className="text-sm text-gray-600">Version 1.0.0</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Features</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Role-based access control (Owner, Manager, Waiter)</li>
                  <li>• Menu and category management</li>
                  <li>• Order processing with status tracking</li>
                  <li>• Table and reservation management</li>
                  <li>• Staff management</li>
                  <li>• Sales reports and analytics</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Settings
