import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tableApi } from '@/services/api'
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
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const Tables = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTable, setEditingTable] = useState(null)
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
    location: '',
    status: 'Available',
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: tables, isLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: () => tableApi.getAll().then((res) => res.data),
  })

  const createMutation = useMutation({
    mutationFn: (data) => tableApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      setIsAddDialogOpen(false)
      resetForm()
      toast({ title: 'Table created successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to create table', variant: 'destructive' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => tableApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      setEditingTable(null)
      resetForm()
      toast({ title: 'Table updated successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to update table', variant: 'destructive' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => tableApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      toast({ title: 'Table deleted successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to delete table', variant: 'destructive' })
    },
  })

  const resetForm = () => {
    setFormData({
      tableNumber: '',
      capacity: '',
      location: '',
      status: 'Available',
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      capacity: parseInt(formData.capacity),
    }

    if (editingTable) {
      updateMutation.mutate({ id: editingTable.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (table) => {
    setEditingTable(table)
    setFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity.toString(),
      location: table.location || '',
      status: table.status,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this table?')) {
      deleteMutation.mutate(id)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800'
      case 'Occupied':
        return 'bg-red-100 text-red-800'
      case 'Reserved':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Table Management</h1>
          <p className="text-gray-500">Manage your cafe tables</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTable ? 'Edit Table' : 'Add Table'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tableNumber">Table Number</Label>
                <Input
                  id="tableNumber"
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Indoor, Outdoor, Window"
                />
              </div>
              {editingTable && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Occupied">Occupied</SelectItem>
                      <SelectItem value="Reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                {editingTable ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables?.map((table) => (
          <Card key={table.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Table {table.tableNumber}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 mt-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Capacity: {table.capacity}</span>
                  </div>
                  {table.location && (
                    <p className="text-sm text-gray-500">{table.location}</p>
                  )}
                  <Badge className={`mt-3 ${getStatusColor(table.status)}`}>
                    {table.status}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(table)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(table.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tables?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tables found. Add your first table to get started.</p>
        </div>
      )}
    </div>
  )
}

export default Tables
